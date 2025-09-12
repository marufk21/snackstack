import AuthCheck from "@/components/auth/auth-check";
import Navbar from "@/components/layout/navbar";
import { SignUpButton, SignInButton } from "@clerk/nextjs";

const Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background dark:from-gray-900 dark:via-black dark:to-gray-900">
      <AuthCheck />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              SnackStack
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Modern solutions for modern problems. Build faster, scale better,
            and deliver exceptional experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignUpButton>
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
                Get Started
              </button>
            </SignUpButton>
            <SignInButton>
              <button className="border border-border text-muted-foreground hover:text-foreground hover:border-foreground/50 px-8 py-4 rounded-lg font-medium transition-all duration-200">
                Sign In
              </button>
            </SignInButton>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-card backdrop-blur-sm rounded-xl p-6 border border-border"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{i}</span>
                </div>
                <h3 className="text-card-foreground font-semibold text-lg mb-2">
                  Feature {i}
                </h3>
                <p className="text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zustand + React Query Demo */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Zustand + React Query Demo
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              This section demonstrates how to use Zustand for state management
              and React Query for data fetching together. The user management
              interface shows CRUD operations with optimistic updates and
              notifications.
            </p>
          </div>
        </div>
      </section>

      {/* More content to demonstrate scroll */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Scroll to see the sticky navbar in action
          </h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="bg-card/30 rounded-lg p-8 border border-border/30"
              >
                <h3 className="text-card-foreground font-semibold text-xl mb-4">
                  Section {i}
                </h3>
                <p className="text-muted-foreground">
                  This is additional content to demonstrate the sticky navbar
                  behavior. As you scroll down, the navbar will remain fixed at
                  the top with enhanced styling.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
