import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, addDoc, query, orderBy, limit, getDocs, increment, serverTimestamp } from "firebase/firestore";

// Your Firebase config securely loaded from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
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
        photoURL: user.photoURL || user.photoUrl || null,
        plan: 'free',
        isUnlimited: false,
        schoolName: null,
        class: null,
        district: null,
        stats: {
          questionsAsked: 0,
          topicsLearned: 0,
          quizTotalScore: 0, 
          quizzesSubmitted: 0
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } else {
      await setDoc(userRef, {
        email: user.email,
        name: name || user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL || user.photoUrl || docSnap.data().photoURL || null,
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
      // Fetch user doc first to check if we need to reset usedToday
      const userSnap = await getDoc(userRef);
      let newUsedToday = 1;
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        const lastUpdated = new Date(data.lastActiveDate || data.updatedAt || new Date().toISOString());
        const now = new Date();
        
        // If it's a new day, reset usedToday to 1. Otherwise, increment.
        if (lastUpdated.toDateString() === now.toDateString()) {
          newUsedToday = (data.usedToday || 0) + 1;
        }
      }

      await updateDoc(userRef, {
        "stats.questionsAsked": increment(1),
        usedToday: newUsedToday,
        lastActiveDate: new Date().toISOString(),
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

    // Add activity log document with truncated title for UI clarity
    const activitiesRef = collection(db, 'users', userId, 'activities');
    await addDoc(activitiesRef, {
      title: title.length > 50 ? title.substring(0, 47) + "..." : title,
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

    const profile = userSnap.exists() ? userSnap.data() : null;
    const plan = profile?.plan || 'free';
    const isUnlimited = profile?.isUnlimited || false;

    return { stats, recentActivities, plan, isUnlimited, profile };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return { 
      stats: { questionsAsked: 0, topicsLearned: 0, quizAverage: 0 }, 
      recentActivities: [],
      plan: 'free',
      isUnlimited: false
    };
  }
};

export const getUserProfileInfo = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      
      // Auto-downgrade logic if subscription has expired
      let currentPlan = data.plan || 'free';
      let currentLimit = data.dailyLimit ?? (currentPlan === 'premium' ? 100 : 5);
      
      if (currentPlan === 'premium' && data.subscriptionEnd) {
        const end = new Date(data.subscriptionEnd).getTime();
        const now = new Date().getTime();
        if (now > end) {
          // Subscription expired
          currentPlan = 'free';
          currentLimit = 5;
          // Update the database to reflect the downgrade
          await updateDoc(userRef, {
            plan: 'free',
            dailyLimit: 5,
            updatedAt: new Date().toISOString()
          });
        }
      }

      // Provide default fallback values for missing fields
      return {
        ...data,
        plan: currentPlan,
        role: data.role || 'user',
        dailyLimit: currentLimit,
        usedToday: data.usedToday || 0,
        isUnlimited: data.isUnlimited || false,
        practiceFreeTrialsUsed: data.practiceFreeTrialsUsed || 0,
        schoolName: data.schoolName || null,
        class: data.class || null,
        district: data.district || null,
        subscriptionStart: data.subscriptionStart || null,
        subscriptionEnd: data.subscriptionEnd || null,
        createdAt: data.createdAt || data.updatedAt || new Date().toISOString(),

        photoURL: data.photoURL || null,
        stats: data.stats || {
          questionsAsked: 0,
          topicsLearned: 0,
          quizTotalScore: 0, 
          quizzesSubmitted: 0
        }
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile info:", error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, data: { name?: string, photoURL?: string, class?: string, district?: string }) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
