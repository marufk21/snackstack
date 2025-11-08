import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        // token.sub may be email or database ID
        session.user.id = token.sub;
        // Get subscription status from token
        if (token.isSubscribed !== undefined) {
          session.user.isSubscribed = Boolean(token.isSubscribed);
        }
        // Restore user properties from token
        if (token.email) session.user.email = token.email as string;
        if (token.name) session.user.name = token.name as string;
        if (token.picture) session.user.image = token.picture as string;
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      // On first sign-in, store user info in token
      // Note: We use email as ID initially to keep this Edge-compatible
      // API routes will resolve email to database ID and handle user creation
      if (account && profile) {
        token.sub = profile.email as string; // Store email initially
        token.email = profile.email;
        token.name = profile.name;
        token.picture = (profile as any).picture || profile.image;
        token.isSubscribed = false; // Default value, will be updated by API routes
      }

      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
});
