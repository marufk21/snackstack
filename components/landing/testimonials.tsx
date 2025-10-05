"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Product Manager",
      company: "TechCorp",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      content: "SnackStack has completely transformed how I capture and organize my thoughts. The AI suggestions help me express ideas more clearly and find connections I would have otherwise missed. It's like having a thinking partner!",
      rating: 5,
      featured: true
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      role: "Research Scientist",
      company: "InnovateLabs",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      content: "As someone who takes thousands of notes, SnackStack's AI-powered organization has saved me countless hours. The automatic tagging and relationship mapping features are game-changers for research work.",
      rating: 5,
      featured: false
    },
    {
      id: 3,
      name: "Emily Johnson",
      role: "Content Creator",
      company: "CreativeStudio",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      content: "The collaborative features are outstanding. My team and I use SnackStack to brainstorm ideas, and the AI suggestions often spark new creative directions we hadn't considered. It's become essential to our workflow.",
      rating: 5,
      featured: false
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
            <Quote className="w-4 h-4 text-blue-500" />
            <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
              Testimonials
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            What Our{" "}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Users Say
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it. See how SnackStack is helping 
            individuals and teams capture and enhance their ideas.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className={`group relative ${
                testimonial.featured ? "lg:col-span-1 lg:row-span-1" : ""
              }`}
            >
              <div className="bg-card border border-border rounded-2xl p-8 h-full hover:shadow-2xl transition-all duration-500 hover:border-purple-500/30 hover:-translate-y-1 relative overflow-hidden">
                {/* Background Gradient Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 text-purple-500/20 group-hover:text-purple-500/30 transition-colors duration-300">
                  <Quote className="w-8 h-8" />
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-6 relative z-10">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Testimonial Content */}
                <div className="relative z-10 space-y-6">
                  <blockquote className="text-foreground leading-relaxed text-lg font-medium">
                    "{testimonial.content}"
                  </blockquote>

                  {/* Author Info */}
                  <div className="flex items-center gap-4 pt-4 border-t border-border">
                    <div className="relative">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={56}
                        height={56}
                        className="rounded-full object-cover ring-2 ring-purple-500/20 group-hover:ring-purple-500/40 transition-all duration-300"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                      <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Featured Badge */}
                {testimonial.featured && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Featured
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Join Thousands of Happy Users
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Ready to transform how you capture and enhance your ideas? Start your journey with 
              SnackStack today and experience the power of AI-powered note-taking.
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
              Start Free Trial
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;