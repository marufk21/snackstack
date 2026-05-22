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
        <div ref={headerRef} className="text-center mb-6 sm:mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
            </span>
            <span className="text-violet-600 dark:text-violet-400 text-xs font-semibold uppercase tracking-wider">
              Contact Us
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-2 sm:mb-4 lg:mb-6 tracking-tight">
            Get in{" "}
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
              Touch
            </span>
          </h2>
          <p className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
            Have a question or want to collaborate? We'd love to hear from you.
            Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-4 lg:gap-8 items-stretch">
          {/* Contact Info — 2 cols on desktop */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-5">
            {/* Email Card */}
            <div className="group bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 backdrop-blur-sm hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="bg-violet-500/10 rounded-2xl p-3 text-violet-600 dark:text-violet-400 group-hover:bg-violet-500 group-hover:text-white transition-all duration-300">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Email Us</h4>
                  <p className="text-sm text-muted-foreground mb-2">Our friendly team is here to help.</p>
                  <a href="mailto:hello@snackstack.com" className="text-sm font-medium text-violet-600 dark:text-violet-400 hover:underline">hello@snackstack.com</a>
                </div>
              </div>
            </div>

            {/* Support Card */}
            <div className="group bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 backdrop-blur-sm hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="bg-emerald-500/10 rounded-2xl p-3 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Support</h4>
                  <p className="text-sm text-muted-foreground mb-2">24/7 support for all our users.</p>
                  <a href="#" className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline">Visit Help Center</a>
                </div>
              </div>
            </div>

            {/* Community Card */}
            <div className="bg-gradient-to-br from-violet-600 via-fuchsia-500 to-indigo-600 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <h3 className="text-xl font-bold mb-2">Join our Community</h3>
                <p className="text-white/70 text-sm mb-5">Connect with other users, share tips, and get early access to new features.</p>
                <Button variant="secondary" className="w-full rounded-full bg-white text-violet-600 hover:bg-white/90 border-0 font-semibold">
                  Join Discord
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Form — 3 cols on desktop */}
          <div ref={formRef} className="lg:col-span-3 bg-white/50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 backdrop-blur-sm shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="form-field">
                  <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
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
                    className="w-full h-11 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border-gray-200 dark:border-white/10 focus:border-violet-500 transition-colors"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
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
                    className="w-full h-11 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border-gray-200 dark:border-white/10 focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
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
                  className="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-white/10 rounded-xl shadow-xs outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all placeholder:text-muted-foreground resize-none text-foreground"
                />
              </div>

              {submitStatus === "success" && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-400 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Message sent! We'll get back to you soon.</span>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
                  Something went wrong. Please email us directly at{" "}
                  <a href="mailto:hello@snackstack.com" className="underline font-medium">
                    hello@snackstack.com
                  </a>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-full py-3 text-base font-semibold shadow-lg hover:shadow-indigo-500/30 transition-all duration-300"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
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
