import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "student@axom.ai" },
        password: { label: "Password", type: "password" },
        idToken: { label: "ID Token", type: "text" }
      },
      async authorize(credentials) {
        try {
          const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBxfbqojx77siLtSCIZmymTA_SLnX06RL8";

          // If logging in via Google or Magic Link, we pass the idToken directly from the frontend
          if (credentials?.idToken) {
            const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                idToken: credentials.idToken
              })
            });

            const data = await res.json();
            
            if (data.error || !data.users || data.users.length === 0) {
              console.error("Firebase Auth Error (idToken):", data.error?.message || "User not found");
              return null;
            }

            const user = data.users[0];
            return {
              id: user.localId,
              name: user.displayName || user.email?.split('@')[0] || "User",
              email: user.email,
              image: user.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
            };
          }

          // Otherwise, fall back to email and password
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              returnSecureToken: true,
            })
          });

          const data = await res.json();

          if (data.error) {
            console.error("Firebase Auth Error (password):", data.error.message);
            return null;
          }

          return {
            id: data.localId,
            name: data.displayName || credentials.email.split('@')[0],
            email: data.email,
            image: data.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = user.email === 'mainulhoque2170@gmail.com';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-expect-error
        session.user.id = token.sub;
        // @ts-expect-error
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "axom-ai-super-secret-key-for-dev",
};
