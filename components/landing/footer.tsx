"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Twitter, 
  Linkedin, 
  Instagram,
  ArrowRight,
  Heart,
  ExternalLink
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "/features" },
        { label: "Pricing", href: "/app/pricing" },
        { label: "Documentation", href: "/docs" },
        { label: "API Reference", href: "/api-docs" },
        { label: "Changelog", href: "/changelog" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Press Kit", href: "/press" },
        { label: "Partners", href: "/partners" },
        { label: "Contact", href: "/contact" }
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Help Center", href: "/help" },
        { label: "Community", href: "/community" },
        { label: "Blog", href: "/blog" },
        { label: "Tutorials", href: "/tutorials" },
        { label: "Webinars", href: "/webinars" }
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
        { label: "GDPR", href: "/gdpr" },
        { label: "Security", href: "/security" }
      ]
    }
  ];

  const socialLinks = [
    { 
      icon: <Github className="w-5 h-5" />, 
      href: "https://github.com/snackstack", 
      label: "GitHub" 
    },
    { 
      icon: <Twitter className="w-5 h-5" />, 
      href: "https://twitter.com/snackstack", 
      label: "Twitter" 
    },
    { 
      icon: <Linkedin className="w-5 h-5" />, 
      href: "https://linkedin.com/company/snackstack", 
      label: "LinkedIn" 
    },
    { 
      icon: <Instagram className="w-5 h-5" />, 
      href: "https://instagram.com/snackstack", 
      label: "Instagram" 
    }
  ];

  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
      value: "hello@snackstack.com",
      href: "mailto:hello@snackstack.com"
    },
    {
      icon: <Phone className="w-5 h-5" />,
      label: "Phone",
      value: "+1 (555) 123-4567",
      href: "tel:+15551234567"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "Address",
      value: "123 Innovation St, Tech City, TC 12345",
      href: "https://maps.google.com/?q=123+Innovation+St+Tech+City"
    }
  ];

  return (
    <footer className="bg-gradient-to-b from-background to-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 w-fit">
                <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl w-12 h-12 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <div>
                  <span className="text-foreground font-bold text-2xl">
                    SnackStack
                  </span>
                  <div className="text-sm text-muted-foreground">
                    Modern Solutions
                  </div>
                </div>
              </Link>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed max-w-md">
                Empowering developers and businesses with cutting-edge tools 
                and solutions. Build faster, scale better, and deliver 
                exceptional digital experiences.
              </p>

              {/* Contact Info */}
              <div className="space-y-4">
                {contactInfo.map((contact, index) => (
                  <motion.a
                    key={index}
                    href={contact.href}
                    target={contact.href.startsWith('http') ? '_blank' : undefined}
                    rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="flex items-center gap-3 text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 group"
                  >
                    <div className="text-purple-500 group-hover:scale-110 transition-transform duration-200">
                      {contact.icon}
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground/70 uppercase tracking-wide">
                        {contact.label}
                      </div>
                      <div className="font-medium">
                        {contact.value}
                      </div>
                    </div>
                    {contact.href.startsWith('http') && (
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    )}
                  </motion.a>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="bg-card border border-border rounded-lg p-3 text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all duration-300 hover:scale-110"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Footer Links */}
            {footerSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * sectionIndex }}
                className="space-y-6"
              >
                <h3 className="text-foreground font-semibold text-lg">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.05 * linkIndex }}
                    >
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 flex items-center gap-1 group w-fit"
                      >
                        {link.label}
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="py-12 border-t border-border"
        >
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h3 className="text-2xl font-bold text-foreground">
              Stay Updated
            </h3>
            <p className="text-muted-foreground">
              Get the latest updates, features, and development tips delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="py-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <div className="flex items-center gap-1 text-muted-foreground">
            <span>© {currentYear} SnackStack. Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
            <span>in Tech City.</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/status"
              className="text-muted-foreground hover:text-green-600 transition-colors duration-200 flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              System Status
            </Link>
            <Link
              href="/sitemap"
              className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
            >
              Sitemap
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;