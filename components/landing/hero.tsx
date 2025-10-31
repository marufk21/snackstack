"use client";

import { SignUpButton, SignInButton } from "@clerk/nextjs";
import Dither from "@/components/landing/dither";

import PageWrapper from "@/components/landing/page-wrapper";
import { usePostHog } from "@/hooks/use-posthog";

const Hero = () => {
  const { capture } = usePostHog();

  return (
    <PageWrapper>
      <div className="absolute inset-0 z-0">
        <Dither
          waveColor={[0.4, 0.1, 0.6]}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.3}
          colorNum={8}
          waveAmplitude={0.3}
          waveFrequency={3}
          waveSpeed={0.1}
        />
      </div>

      <div className="relative z-10 text-center h-full flex flex-col justify-center py-36">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
          <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent">
            AI-Powered Notes
          </span>
          <br />
          <span className="text-2xl sm:text-3xl lg:text-4xl font-light text-white">
            for Modern Teams
          </span>
        </h1>
        <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
          Capture, organize, and enhance your ideas with the power of artificial
          intelligence. The smart way to take notes for individuals and teams.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <SignUpButton>
            <button
              onClick={() =>
                capture("get_started_clicked", {
                  button: "get_started",
                  location: "landing_page",
                })
              }
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg font-medium transition-all duration-200 hover:scale-105"
            >
              Get Started
            </button>
          </SignUpButton>
          <SignInButton>
            <button
              onClick={() =>
                capture("sign_in_clicked", {
                  button: "sign_in",
                  location: "landing_page",
                })
              }
              className="border border-white/30 bg-white/10 backdrop-blur-sm text-white hover:text-white hover:border-white/60 hover:bg-white/20 px-8 py-4 rounded-lg font-medium transition-all duration-200 hover:scale-105"
            >
              Sign In
            </button>
          </SignInButton>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Hero;
