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
        session.user.id = token.sub;
        if (token.isSubscribed !== undefined) {
          session.user.isSubscribed = Boolean(token.isSubscribed);
        }
        if (token.email) session.user.email = token.email as string;
        if (token.name) session.user.name = token.name as string;
        if (token.picture) session.user.image = token.picture as string;
      }
      return session;
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const { getOrCreateUserByEmail } = await import("@/server/services/user");
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
