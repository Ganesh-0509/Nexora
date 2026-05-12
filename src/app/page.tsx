"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Zap, Target, Globe } from "lucide-react";
import Link from "next/link";
import posthog from "posthog-js";

export default function LandingPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background selection:bg-primary/10">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />

      <Navbar />

      <main className="relative pt-32">
        {/* Hero Section */}
        <section className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center"
          >
            <motion.div
              variants={item}
              className="mb-6 flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm"
            >
              <Sparkles className="h-4 w-4" />
              <span>Next-gen student discovery platform</span>
            </motion.div>

            <motion.h1
              variants={item}
              className="max-w-4xl font-outfit text-5xl font-extrabold tracking-tight sm:text-7xl"
            >
              Unlock your next <br />
              <span className="text-gradient">career breakthrough</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
            >
              Nexora uses AI to match you with the best hackathons, internships, and scholarships tailored to your skills and goals.
            </motion.p>

            <motion.div
              variants={item}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
            >
              <Link href="/signup" onClick={() => posthog.capture("signup_cta_clicked", { location: "hero" })}>
                <Button size="lg" className="h-12 rounded-xl px-8 text-base shadow-xl shadow-primary/20">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="h-12 rounded-xl px-8 text-base">
                  See how it works
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Image/Mockup Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1, type: "spring", bounce: 0.2 }}
            className="mt-20 relative mx-auto max-w-5xl"
          >
            <div className="relative rounded-2xl border border-border bg-card/50 p-2 shadow-2xl backdrop-blur-sm overflow-hidden">
               <img 
                  src="/images/dashboard-preview.png" 
                  alt="Nexora Dashboard Preview" 
                  className="w-full h-auto rounded-xl border border-border/50"
               />
            </div>
            {/* Decorative elements */}
            <div className="absolute -z-10 -top-8 -right-8 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
            <div className="absolute -z-10 -bottom-8 -left-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-32">
           <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                 { title: "AI-Powered Matching", desc: "Our algorithms learn your preferences to surface only the most relevant opportunities.", icon: Zap },
                 { title: "Personalized Roadmap", desc: "Get a clear path to your dream career based on successful student journeys.", icon: Target },
                 { title: "Global Reach", desc: "Access exclusive opportunities from top companies and organizations worldwide.", icon: Globe }
              ].map((feature, i) => (
                 <motion.div 
                    key={i}
                    whileHover={{ y: -5 }}
                    className="p-8 rounded-2xl border border-border bg-card/30 backdrop-blur-sm hover:border-primary/50 transition-colors"
                 >
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                       <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.desc}</p>
                 </motion.div>
              ))}
           </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card/30 py-12">
         <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
               <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                  <Sparkles className="h-5 w-5" />
               </div>
               <span className="font-outfit text-lg font-bold">Nexora</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2026 Nexora Platform. All rights reserved.</p>
            <div className="flex items-center gap-6">
               <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy</Link>
               <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Terms</Link>
               <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Twitter</Link>
            </div>
         </div>
      </footer>
    </div>
  );
}
