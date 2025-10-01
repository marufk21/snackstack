import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background dark:from-gray-900 dark:via-black dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Join SnackStack
          </h1>
          <p className="text-muted-foreground">
            Create your account to get started
          </p>
        </div>
        <SignUp
          fallbackRedirectUrl="/app"
          forceRedirectUrl="/app"
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
              card: "bg-background border border-border shadow-lg",
              headerTitle: "text-foreground",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton:
                "bg-background border border-border hover:bg-accent",
              socialButtonsBlockButtonText: "text-foreground",
              formFieldLabel: "text-foreground",
              formFieldInput:
                "bg-background border border-border text-foreground",
              footerActionLink: "text-primary hover:text-primary/80",
              footerActionText: "text-muted-foreground",
            },
          }}
        />
      </div>
    </div>
  );
}