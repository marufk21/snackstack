"use client";

import React from "react";
import { motion } from "framer-motion";
import { SignUpButton } from "@clerk/nextjs";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { usePostHog } from "@/hooks/use-posthog";

const CTA = () => {
  const { capture } = usePostHog();

  const benefits = [
    "14-day free trial",
    "No credit card required",
    "Cancel anytime",
    "24/7 support included"
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-purple-900/10 via-background to-blue-900/10 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Header Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full px-6 py-3 mb-8"
        >
          <Sparkles className="w-5 h-5 text-purple-500" />
          <span className="text-purple-600 dark:text-purple-400 font-medium">
            Ready to Get Started?
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight"
        >
          Transform Your Development
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Experience Today
          </span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Join thousands of developers and teams who are already building faster, 
          scaling better, and delivering exceptional experiences with SnackStack.
        </motion.p>

        {/* Benefits List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-6 mb-12"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 hover:border-green-500/30 transition-colors duration-300"
            >
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-muted-foreground">
                {benefit}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <SignUpButton>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                capture("cta_get_started_clicked", {
                  button: "get_started",
                  location: "cta_section",
                })
              }
              className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-10 py-4 rounded-xl font-semibold transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 flex items-center gap-3"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </motion.button>
          </SignUpButton>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              capture("cta_demo_clicked", {
                button: "book_demo",
                location: "cta_section",
              })
            }
            className="border border-border hover:border-purple-500/50 text-foreground hover:text-purple-600 dark:hover:text-purple-400 px-10 py-4 rounded-xl font-semibold transition-all duration-300 hover:bg-purple-500/5"
          >
            Book a Demo
          </motion.button>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 pt-12 border-t border-border"
        >
          <div className="text-sm text-muted-foreground mb-6">
            Trusted by teams at
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12 opacity-60 hover:opacity-80 transition-opacity duration-300">
            {[
              "TechCorp",
              "StartupXYZ", 
              "InnovateLabs",
              "DevStudio",
              "CodeCraft"
            ].map((company, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="text-muted-foreground font-semibold text-lg hover:text-foreground transition-colors duration-300"
              >
                {company}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Urgency Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-full px-4 py-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            <span className="text-orange-600 dark:text-orange-400 text-sm font-medium">
              Limited time: Get 3 months free with annual plans
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;