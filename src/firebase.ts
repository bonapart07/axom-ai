import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, addDoc, query, orderBy, limit, getDocs, increment, serverTimestamp } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBxfbqojx77siLtSCIZmymTA_SLnX06RL8",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "axom-ai-f5abc.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "axom-ai-f5abc",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "axom-ai-f5abc.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1048797243842",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1048797243842:web:4ba72d956ce8a925e68e5b",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export Auth, Google Auth Provider & Firestore
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Helper to sync user auth state to Firestore Database
export const syncUserToFirestore = async (user: any, name: string | null = null) => {
  if (!user) return;
  try {
    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);
    
    // Only set stats if document doesn't exist
    if (!docSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        name: name || user.displayName || user.email.split('@')[0],
        plan: 'free',
        isUnlimited: false,
        schoolName: null,
        stats: {
          questionsAsked: 0,
          topicsLearned: 0,
          quizTotalScore: 0, 
          quizzesSubmitted: 0
        },
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } else {
      await setDoc(userRef, {
        email: user.email,
        name: name || user.displayName || user.email.split('@')[0],
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
  } catch (error) {
    console.error("Error syncing user to Firestore:", error);
  }
};

export const logUserActivity = async (userId: string, type: "Chat" | "Notes" | "Quiz", title: string, scoreParams?: { score: number, total: number }) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    // Update top level stats depending on activity type
    if (type === "Chat") {
      await updateDoc(userRef, {
        "stats.questionsAsked": increment(1),
        updatedAt: new Date().toISOString()
      });
    } else if (type === "Quiz" && scoreParams) {
      const percentage = Math.round((scoreParams.score / scoreParams.total) * 100);
      await updateDoc(userRef, {
        "stats.topicsLearned": increment(1),
        "stats.quizzesSubmitted": increment(1),
        "stats.quizTotalScore": increment(percentage),
        updatedAt: new Date().toISOString()
      });
    } else if (type === "Notes") {
      await updateDoc(userRef, {
        "stats.topicsLearned": increment(1),
        updatedAt: new Date().toISOString()
      });
    }

    // Add exactly one activity log document
    const activitiesRef = collection(db, 'users', userId, 'activities');
    await addDoc(activitiesRef, {
      title,
      type,
      createdAt: serverTimestamp()
    });

  } catch (error) {
    console.error("Error logging activity:", error);
  }
};

export const getUserDashboardData = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    const stats = { questionsAsked: 0, topicsLearned: 0, quizAverage: 0 };
    if (userSnap.exists()) {
      const dbStats = userSnap.data().stats;
      if (dbStats) {
        stats.questionsAsked = dbStats.questionsAsked || 0;
        stats.topicsLearned = dbStats.topicsLearned || 0;
        const total = dbStats.quizTotalScore || 0;
        const count = dbStats.quizzesSubmitted || 0;
        stats.quizAverage = count > 0 ? Math.round(total / count) : 0;
      }
    }

    const activitiesRef = collection(db, 'users', userId, 'activities');
    const q = query(activitiesRef, orderBy("createdAt", "desc"), limit(5));
    const querySnapshot = await getDocs(q);
    
    const recentActivities: any[] = [];
    querySnapshot.forEach((doc) => {
      recentActivities.push({ id: doc.id, ...doc.data() });
    });

    return { stats, recentActivities };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return { 
      stats: { questionsAsked: 0, topicsLearned: 0, quizAverage: 0 }, 
      recentActivities: [] 
    };
  }
};