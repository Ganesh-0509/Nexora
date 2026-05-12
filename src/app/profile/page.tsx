"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { User, Settings, Shield, Bell, Globe, Link as LinkIcon, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="relative mb-20">
          <div className="h-48 w-full rounded-3xl bg-gradient-to-r from-primary/20 via-primary/10 to-background border border-border" />
          <div className="absolute -bottom-12 left-8 flex items-end gap-6">
            <div className="h-32 w-32 rounded-3xl bg-card border-4 border-background shadow-xl flex items-center justify-center overflow-hidden">
               <User className="h-16 w-16 text-muted-foreground" />
            </div>
            <div className="pb-4">
              <h1 className="text-3xl font-bold font-outfit">Student Name</h1>
              <p className="text-muted-foreground">University Student • Joined May 2026</p>
            </div>
          </div>
          <div className="absolute -bottom-6 right-8">
             <Button variant="outline" className="rounded-xl gap-2">
                <Settings className="h-4 w-4" />
                Edit Profile
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Stats & Links */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl border border-border bg-card/30 backdrop-blur-sm">
               <h3 className="font-bold mb-4">Connections</h3>
               <div className="space-y-4">
                  <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                     <Globe className="h-4 w-4" />
                     <span className="text-sm">github.com/student</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                     <LinkIcon className="h-4 w-4" />
                     <span className="text-sm">linkedin.com/in/student</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                     <Globe className="h-4 w-4" />
                     <span className="text-sm">portfolio.me</span>
                  </div>
               </div>
            </div>

            <div className="p-6 rounded-3xl border border-border bg-card/30 backdrop-blur-sm">
               <h3 className="font-bold mb-2">Completion</h3>
               <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-2">
                  <div className="h-full w-[85%] bg-primary rounded-full" />
               </div>
               <p className="text-xs text-muted-foreground">85% of your profile is complete</p>
            </div>
          </div>

          {/* Right Column: Main Content */}
          <div className="md:col-span-2 space-y-8">
             <div className="p-8 rounded-3xl border border-border bg-card/30 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-6">
                   <Sparkles className="h-5 w-5 text-primary" />
                   <h3 className="text-xl font-bold">Skills & Expertise</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                   {["React", "TypeScript", "Node.js", "Python", "UI Design", "GraphQL", "AWS"].map(skill => (
                      <span key={skill} className="px-4 py-1.5 rounded-xl bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                         {skill}
                      </span>
                   ))}
                </div>
             </div>

             <div className="p-8 rounded-3xl border border-border bg-card/30 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-6">Experience</h3>
                <div className="space-y-8">
                   {[1, 2].map(i => (
                      <div key={i} className="flex gap-4">
                         <div className="h-12 w-12 rounded-xl bg-muted shrink-0" />
                         <div>
                            <h4 className="font-bold">Software Engineer Intern</h4>
                            <p className="text-sm text-muted-foreground">Tech Corp • Summer 2025</p>
                            <p className="mt-2 text-sm text-muted-foreground">
                               Worked on building scalable frontend components using React and Tailwind CSS.
                            </p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
