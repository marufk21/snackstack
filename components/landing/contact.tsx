"use client";

import React, { useState, useRef } from "react";
import { Mail, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGSAP } from "@/hooks/use-gsap";
import gsap from "gsap";
import PageWrapper from "./page-wrapper";

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Create mailto link
      const mailtoLink = `mailto:hello@snackstack.com?subject=${encodeURIComponent(
        `Contact from ${formData.name}`
      )}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )}`;
      window.location.href = mailtoLink;

      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });

      setTimeout(() => {
        setSubmitStatus("idle");
      }, 3000);
    } catch (error) {
      setSubmitStatus("error");
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  useGSAP(() => {
    // Header animation
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Form animation
    if (formRef.current) {
      const formFields = formRef.current.querySelectorAll(".form-field");

      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        formFields,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.3,
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 75%",
          },
        }
      );
    }
  }, []);

  return (
    <PageWrapper ref={sectionRef} id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-8 md:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
            <Mail className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <span className="text-violet-600 dark:text-violet-400 text-sm font-medium">
              Contact Us
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-3 md:mb-4 lg:mb-6 tracking-tight">
            Get in{" "}
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
              Touch
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
            Have a question or want to collaborate? We'd love to hear from you.
            Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Contact Info */}
          <div className="space-y-5 md:space-y-6 lg:sticky lg:top-24">
            <div className="bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-3xl p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-violet-100 dark:bg-violet-900/30 p-3 rounded-2xl text-violet-600 dark:text-violet-400">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Email Us</h4>
                    <p className="text-muted-foreground mb-1">Our friendly team is here to help.</p>
                    <a href="mailto:hello@snackstack.com" className="text-violet-600 dark:text-violet-400 font-medium hover:underline">hello@snackstack.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-2xl text-indigo-600 dark:text-indigo-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Support</h4>
                    <p className="text-muted-foreground mb-1">24/7 support for all our users.</p>
                    <a href="#" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Visit Help Center</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl">
              <h3 className="text-2xl font-bold mb-4">Join our Community</h3>
              <p className="text-white/80 mb-6">Connect with other users, share tips, and get early access to new features.</p>
              <Button variant="secondary" className="w-full rounded-full bg-white text-violet-600 hover:bg-white/90 border-0">
                Join Discord
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <div ref={formRef} className="bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-3xl p-5 md:p-6 lg:p-8 backdrop-blur-sm shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-field">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what's on your mind..."
                  rows={5}
                  className="w-full min-h-[100px] px-3 py-2 text-base md:text-sm bg-background dark:bg-input/30 border border-input rounded-md shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] placeholder:text-muted-foreground resize-none text-foreground"
                />
              </div>

              {submitStatus === "success" && (
                <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Message sent! We'll get back to you soon.</span>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
                  Something went wrong. Please email us directly at{" "}
                  <a href="mailto:hello@snackstack.com" className="underline">
                    hello@snackstack.com
                  </a>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-full py-6 text-lg font-semibold shadow-lg hover:shadow-indigo-500/30 transition-all duration-300"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Contact;
