import { db as prisma } from "./client";

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    include: {
      subscription: true,
      notes: true,
    },
  });
}

/**
 * Get user by ID
 */
export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      subscription: true,
      notes: true,
    },
  });
}

/**
 * Create a new user (typically called by NextAuth adapter)
 */
export async function createUser(data: {
  name: string;
  email: string;
  image?: string;
}) {
  return await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      image: data.image,
      isSubscribed: false,
      lastActiveAt: new Date(),
    },
    include: {
      subscription: true,
      notes: true,
    },
  });
}

/**
 * Get or create user by email
 */
export async function getOrCreateUserByEmail(email: string, name: string) {
  let user = await getUserByEmail(email);
  
  if (!user) {
    user = await createUser({ email, name });
  }
  
  return user;
}

/**
 * Update user
 */
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
    include: {
      subscription: true,
      notes: true,
    },
  });
}

/**
 * Update user's subscription status
 */
export async function updateUserSubscriptionStatus(
  userId: string,
  isSubscribed: boolean
) {
  return await prisma.user.update({
    where: { id: userId },
    data: { isSubscribed },
  });
}

