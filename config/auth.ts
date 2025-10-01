// Authentication configuration (Clerk)
export const authConfig = {
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up',
  fallbackRedirectUrl: '/app',
  forceRedirectUrl: '/app',
} as const

export const getAuthConfig = () => {
  if (!authConfig.publishableKey || !authConfig.secretKey) {
    throw new Error('Clerk configuration is incomplete. Please check your environment variables.')
  }
  return authConfig
}