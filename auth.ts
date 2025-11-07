import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/server/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
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
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        
        // Get latest subscription status from database
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { isSubscribed: true },
        });
        
        if (dbUser) {
          session.user.isSubscribed = dbUser.isSubscribed;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  events: {
    async createUser({ user }) {
      // Update lastActiveAt on user creation
      await prisma.user.update({
        where: { id: user.id },
        data: { lastActiveAt: new Date() },
      });
    },
    async signIn({ user }) {
      // Update lastActiveAt on sign in
      await prisma.user.update({
        where: { id: user.id },
        data: { lastActiveAt: new Date() },
      });
    },
  },
  session: {
    strategy: "database",
  },
  debug: process.env.NODE_ENV === "development",
});

