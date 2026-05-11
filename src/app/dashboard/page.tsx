"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  Trophy, 
  Users, 
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle2
} from "lucide-react";

const stats = [
  { label: "New Opportunities", value: "124", icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Applied", value: "12", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Saved", value: "48", icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10" },
  { label: "Profile Views", value: "1.2k", icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-outfit">Welcome back, Alex 👋</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your opportunities today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className={stat.bg + " p-3 rounded-xl " + stat.color}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="flex items-center text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-full">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12%
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-muted-foreground">{stat.label}</h3>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Opportunities */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Recommended for you</h2>
              <button className="text-sm font-medium text-primary hover:underline">View all</button>
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (item * 0.1) }}
                  className="group p-5 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all cursor-pointer"
                >
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center font-bold text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      {item === 1 ? "G" : item === 2 ? "M" : "A"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                          {item === 1 ? "Software Engineer Intern" : item === 2 ? "Full-Stack Developer" : "Product Design Fellow"}
                        </h3>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          2h ago
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item === 1 ? "Google" : item === 2 ? "Meta" : "Adobe"} • Remote • $4k - $6k
                      </p>
                      <div className="flex gap-2 mt-3">
                        <span className="px-2 py-1 rounded-md bg-secondary text-[10px] font-bold uppercase tracking-wider text-muted-foreground">React</span>
                        <span className="px-2 py-1 rounded-md bg-secondary text-[10px] font-bold uppercase tracking-wider text-muted-foreground">TypeScript</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Activity/Sidebar Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Upcoming Deadlines</h2>
            <div className="space-y-4">
              {[1, 2].map((item) => (
                <div key={item} className="p-4 rounded-2xl border border-border bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-600 bg-amber-500/10 px-2 py-1 rounded-full">3 days left</span>
                  </div>
                  <h4 className="font-semibold text-sm">HackerCup 2026 Finals</h4>
                  <p className="text-xs text-muted-foreground mt-1">Competitive Programming</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
