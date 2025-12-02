"use client";

import {
  Hero,
  About,
  Services,
  Footer,
} from "@/components/landing";
import dynamic from "next/dynamic";

const Pricing = dynamic(() => import("@/components/landing/pricing"));
const Testimonials = dynamic(() => import("@/components/landing/testimonials"));
const Contact = dynamic(() => import("@/components/landing/contact"));

const Page = () => {
  return (
    <>
    <div className="relative z-10 bg-background" style={{ backgroundColor: 'var(--background)' }}>
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
