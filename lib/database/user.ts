import { db as prisma } from "./client";

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    // Don't include relations initially to avoid potential issues
    // Relations can be loaded separately if needed
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
    // Don't include relations initially to avoid potential issues
  });
}

/**
 * Get or create user by email
 */
export async function getOrCreateUserByEmail(email: string, name?: string | null) {
  try {
    // First, try to get existing user
    let user = await getUserByEmail(email);
    
    if (user) {
      console.log(`✅ User found: ${user.id} (${user.email})`);
      return user;
    }
    
    // User doesn't exist, create them
    console.log(`Creating new user for email: ${email}`);
    const userName = name || email.split("@")[0] || "User";
    
    user = await createUser({ 
      email, 
      name: userName
    });
    
    console.log(`✅ User created: ${user.id} (${user.email})`);
    return user;
  } catch (error: any) {
    // Log the full error for debugging
    console.error("❌ Error in getOrCreateUserByEmail:", {
      email,
      name,
      error: error?.message,
      code: error?.code,
      meta: error?.meta,
      stack: error?.stack?.split("\n").slice(0, 5), // First 5 lines of stack
    });
    
    // Re-throw with more context
    const enhancedError = new Error(
      `Failed to get or create user: ${error?.message || "Unknown error"}`
    );
    (enhancedError as any).code = error?.code;
    (enhancedError as any).meta = error?.meta;
    throw enhancedError;
  }
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

