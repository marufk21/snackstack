"use client";

import {
  Hero,
  About,
  Services,
  Testimonials,
  Pricing,
  Contact,
  Footer,
} from "@/components/landing";

const Page = () => {
  return (
    <>
    <div className="relative z-10 bg-background">
        <Hero />
        <About />
        <Services />
        <Pricing />
        <Testimonials />
        <Contact />
      </div>
      <Footer />
    </>
  );
};

export default Page;
