"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Sparkles, Target, Zap, Globe, Shield, Users } from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "Real-time Discovery",
      description: "We aggregate opportunities from 10+ platforms including Devpost, LinkedIn, and more."
    },
    {
      icon: <Target className="h-6 w-6 text-primary" />,
      title: "AI Matching",
      description: "Our scoring engine evaluates your profile against every opportunity to find the perfect fit."
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Verified Data",
      description: "Every listing is vetted for quality and authenticity to ensure you spend time on valid apps."
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Student Focused",
      description: "Built specifically for university students and early-career professionals."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center mb-20"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold font-outfit mb-6">
              Empowering the next generation of <span className="text-gradient">tech talent</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Nexora was founded on a simple premise: discovery shouldn't be the bottleneck for success. 
              We're building the infrastructure for students to find their breakthrough.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {features.map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl border border-border bg-card/50 backdrop-blur-sm"
              >
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground text-lg">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="rounded-3xl border border-border bg-primary/5 p-12 text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              To bridge the gap between education and opportunity by creating a transparent, 
              AI-driven discovery layer for students worldwide.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
