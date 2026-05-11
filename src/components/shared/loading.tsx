"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center"
      >
        <Sparkles className="h-6 w-6 text-primary" />
      </motion.div>
      <p className="text-sm font-medium text-muted-foreground animate-pulse">
        Optimizing your opportunities...
      </p>
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="flex h-[80vh] w-full items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
