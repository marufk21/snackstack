import { db as prisma } from "@/server/db/client";

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      isSubscribed: true,
      lastActiveAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      isSubscribed: true,
      lastActiveAt: true,
      createdAt: true,
      updatedAt: true,
      subscription: true,
      notes: true,
    },
  });
}

export async function createUser(data: {
  name?: string | null;
  email: string;
  image?: string | null;
}) {
  return await prisma.user.create({
    data: {
      name: data.name || null,
      email: data.email,
      image: data.image || null,
      isSubscribed: false,
      lastActiveAt: new Date(),
    },
  });
}

export async function getOrCreateUserByEmail(
  email: string,
  name?: string | null
) {
  try {
    let user = await getUserByEmail(email);

    if (user) {
      console.log(`✅ User found: ${user.id} (${user.email})`);
      return user;
    }

    console.log(`Creating new user for email: ${email}`);
    const userName = name || email.split("@")[0] || "User";

    user = await createUser({
      email,
      name: userName,
    });

    console.log(`✅ User created: ${user.id} (${user.email})`);
    return user;
  } catch (error: any) {
    console.error("❌ Error in getOrCreateUserByEmail:", {
      email,
      name,
      error: error?.message,
      code: error?.code,
      meta: error?.meta,
      stack: error?.stack?.split("\n").slice(0, 5),
    });

    const enhancedError = new Error(
      `Failed to get or create user: ${error?.message || "Unknown error"}`
    );
    (enhancedError as any).code = error?.code;
    (enhancedError as any).meta = error?.meta;
    throw enhancedError;
  }
}

export async function updateUser(
  id: string,
  data: {
    name?: string;
    email?: string;
    image?: string;
    isSubscribed?: boolean;
    lastActiveAt?: Date;
  }
) {
  return await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      isSubscribed: true,
      lastActiveAt: true,
      subscription: true,
      notes: true,
    },
  });
}

export async function updateUserSubscriptionStatus(
  userId: string,
  isSubscribed: boolean
) {
  return await prisma.user.update({
    where: { id: userId },
    data: { isSubscribed },
  });
}
