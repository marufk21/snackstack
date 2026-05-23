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
    async jwt({ token, account, profile }) {
      // On first sign-in, look up or create the database user and store
      // the real DB user ID as token.sub. Dynamic import keeps Prisma out
      // of the Edge middleware bundle — DB calls only happen at sign-in.
      if (account && profile) {
        const { getOrCreateUserByEmail } = await import("@/lib/database/user");
        const dbUser = await getOrCreateUserByEmail(
          profile.email!,
          profile.name
        );
        token.sub = dbUser.id;
        token.email = profile.email;
        token.name = profile.name;
        token.picture = (profile as any).picture || profile.image;
        token.isSubscribed = dbUser.isSubscribed ?? false;
      }

      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
});
