"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Code2, 
  Database, 
  Cloud, 
  Smartphone, 
  ArrowRight,
  Sparkles
} from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: <Code2 className="w-8 h-8" />,
      title: "Full-Stack Development",
      description: "Complete web applications built with modern frameworks like Next.js, React, and Node.js. From conception to deployment.",
      features: ["React & Next.js", "TypeScript", "API Development", "Testing"],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Database Solutions",
      description: "Scalable database architecture and optimization. We handle everything from schema design to performance tuning.",
      features: ["PostgreSQL", "Prisma ORM", "Redis Caching", "Data Migration"],
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Cloud Infrastructure",
      description: "Robust cloud deployment and DevOps solutions. Automated CI/CD pipelines and infrastructure as code.",
      features: ["AWS/Vercel", "Docker", "CI/CD", "Monitoring"],
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile-First Design",
      description: "Responsive, accessible, and beautiful user interfaces that work seamlessly across all devices and platforms.",
      features: ["Responsive Design", "Accessibility", "Performance", "UX/UI"],
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-muted/20 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-purple-600 dark:text-purple-400 text-sm font-medium">
              Our Services
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Succeed
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From concept to deployment, we provide comprehensive development services 
            that help your business thrive in the digital landscape.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="group relative"
            >
              <div className="bg-card border border-border rounded-2xl p-8 h-full hover:shadow-2xl transition-all duration-500 hover:border-purple-500/30 hover:-translate-y-2">
                {/* Icon with gradient background */}
                <div className="relative mb-6">
                  <div className={`bg-gradient-to-r ${service.gradient} rounded-xl p-4 text-white w-fit group-hover:scale-110 transition-transform duration-300`}>
                    {service.icon}
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-r ${service.gradient} rounded-xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300`} />
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-purple-600 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features List */}
                  <div className="grid grid-cols-2 gap-2 pt-4">
                    {service.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.gradient}`} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Learn More Button */}
                  <div className="pt-6">
                    <button className="group/btn flex items-center gap-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-colors duration-200">
                      Learn More
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                </div>

                {/* Hover Gradient Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-24 text-center"
        >
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-8 lg:p-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-6">
              Our Mission
            </h3>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              To empower developers and businesses with tools that make building 
              exceptional digital experiences effortless. We believe in the power 
              of great technology to transform ideas into reality, and we're here 
              to make that journey as smooth as possible.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;