"use client";

import { 
  Hero, 
  About, 
  Services, 
  Testimonials, 
  CTA, 
  Footer 
} from "@/components/landing";

const Page = () => {
  return (
    <>
      {/* Hero Section */}
      <Hero />
      
      {/* Landing Page Sections */}
      <About />
      <Services />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
};

export default Page;