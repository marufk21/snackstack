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
 * Get user by Clerk user ID
 */
export async function getUserByClerkId(clerkUserId: string) {
  return await prisma.user.findUnique({
    where: { clerkUserId },
    include: {
      subscription: true,
      notes: true,
    },
  });
}

/**
 * Get user by ID
 */
export async function getUserById(id: number) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      subscription: true,
      notes: true,
    },
  });
}

/**
 * Create a new user
 */
export async function createUser(data: {
  clerkUserId: string;
  name: string;
  email: string;
  imageUrl?: string;
}) {
  return await prisma.user.create({
    data: {
      clerkUserId: data.clerkUserId,
      name: data.name,
      email: data.email,
      imageUrl: data.imageUrl,
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
 * Get or create user by Clerk ID
 */
export async function getOrCreateUserByClerkId(
  clerkUserId: string,
  email: string,
  name: string,
  imageUrl?: string
) {
  let user = await getUserByClerkId(clerkUserId);
  
  if (!user) {
    user = await createUser({ clerkUserId, email, name, imageUrl });
  } else {
    // Update last active timestamp
    user = await updateUser(user.id, { lastActiveAt: new Date() });
  }
  
  return user;
}

/**
 * Get or create user by email (legacy support)
 */
export async function getOrCreateUserByEmail(email: string, name: string) {
  let user = await getUserByEmail(email);
  
  if (!user) {
    // Create a placeholder clerkUserId if not available
    // This should ideally not be used - prefer getOrCreateUserByClerkId
    const tempClerkId = `temp_${Date.now()}_${email}`;
    user = await createUser({ clerkUserId: tempClerkId, email, name });
  }
  
  return user;
}

/**
 * Update user
 */
export async function updateUser(
  id: number,
  data: {
    name?: string;
    email?: string;
    imageUrl?: string;
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
  userId: number,
  isSubscribed: boolean
) {
  return await prisma.user.update({
    where: { id: userId },
    data: { isSubscribed },
  });
}

