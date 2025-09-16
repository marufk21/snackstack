import { SignUpButton, SignInButton } from "@clerk/nextjs";
import LiquidEther from "@/components/LiquidEther";

const Page = () => {
  return (
    <>
      <section className="py-0 px-4 sm:px-6 lg:px-8 h-full">
        <div className="absolute inset-0 z-0">
          <LiquidEther
            colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>

        <div className="relative z-10 text-center h-full flex flex-col justify-center py-36">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6">
            {" "}
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
    </>
  );
};

export default Page;
