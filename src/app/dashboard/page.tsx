"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  Trophy, 
  Users, 
  TrendingUp,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { InfiniteFeed } from "@/components/shared/infinite-feed";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();

  const { data: statsData } = useQuery({
    queryKey: ["user-stats"],
    queryFn: () => api.get<any>("/api/v1/user/stats"),
  });

  const { data: deadlinesData } = useQuery({
    queryKey: ["user-deadlines"],
    queryFn: () => api.get<any>("/api/v1/user/deadlines"),
  });

  const stats = [
    { label: "New Opportunities", value: statsData?.data?.newOpportunities || "...", icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Applied", value: statsData?.data?.applied ?? "...", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Saved", value: statsData?.data?.saved ?? "...", icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Profile Views", value: statsData?.data?.profileViews || "...", icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        <div>
          <h1 className="text-3xl font-bold font-outfit">
            Welcome back, {isLoaded ? (user?.firstName || "Student") : "..."} 👋
          </h1>
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
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Recommended for you</h2>
              </div>
              <button className="text-sm font-medium text-primary hover:underline">View all</button>
            </div>
            
            <div className="mt-4">
               <InfiniteFeed isRecommended />
            </div>
          </div>

          {/* Activity/Sidebar Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Upcoming Deadlines</h2>
            <div className="space-y-4">
              {deadlinesData?.data && deadlinesData.data.length > 0 ? (
                deadlinesData.data.map((item: any, i: number) => {
                  const daysLeft = Math.ceil((new Date(item.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={item.id} className="p-4 rounded-2xl border border-border bg-card shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                          daysLeft <= 5 ? "bg-amber-500/10 text-amber-600" : "bg-primary/10 text-primary"
                        )}>
                          {daysLeft} days left
                        </span>
                      </div>
                      <h4 className="font-semibold text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{item.type}</p>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 rounded-2xl border border-dashed border-border bg-muted/20 text-center">
                  <p className="text-xs text-muted-foreground">Bookmark opportunities to track deadlines here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
