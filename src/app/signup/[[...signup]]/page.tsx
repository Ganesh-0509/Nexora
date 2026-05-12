"use client";

import { SignUp } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="w-full max-w-md flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center mb-8"
        >
          <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground mb-4 shadow-lg shadow-primary/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold font-outfit tracking-tight">Create your account</h1>
          <p className="text-muted-foreground mt-2">Join Nexora and unlock your potential.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full"
        >
          <SignUp 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-card border border-border shadow-2xl rounded-3xl p-2",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "h-12 rounded-xl border-border bg-background hover:bg-muted text-foreground font-medium",
                formButtonPrimary: "bg-primary hover:bg-primary/90 h-12 rounded-xl text-sm font-bold shadow-lg shadow-primary/20",
                formFieldInput: "h-12 rounded-xl border-border bg-background focus:ring-primary focus:border-primary",
                footerActionLink: "text-primary hover:text-primary/80 font-bold",
                identityPreviewText: "text-foreground",
                formFieldLabel: "text-muted-foreground font-medium",
              }
            }}
            signInUrl="/login"
            forceRedirectUrl="/onboarding"
          />
        </motion.div>
      </div>
    </div>
  );
}
