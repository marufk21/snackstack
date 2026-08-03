import { auth } from "@/server/auth/config";

const ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_ID;

export async function isAdmin(): Promise<boolean> {
  const session = await auth();

  if (!session?.user?.email || !ADMIN_ID) {
    return false;
  }

  return session.user.email === ADMIN_ID;
}