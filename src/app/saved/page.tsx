"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useQuery } from "@tanstack/react-query";
import { OpportunityCard } from "@/components/shared/opportunity-card";
import { Bookmark, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function SavedPage() {
  const { data: saved, isLoading } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      const res = await fetch("/api/v1/bookmarks");
      if (!res.ok) throw new Error("Failed to fetch bookmarks");
      return res.json();
    },
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Bookmark className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold font-outfit">Saved Opportunities</h1>
            <p className="text-muted-foreground mt-1">Manage the opportunities you've bookmarked for later.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground font-medium">Loading your saved items...</p>
          </div>
        ) : saved?.data?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-border rounded-3xl bg-card/20">
             <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
                <Bookmark className="h-10 w-10 text-muted-foreground/50" />
             </div>
             <h3 className="text-2xl font-bold font-outfit">No bookmarks yet</h3>
             <p className="text-muted-foreground mt-2 max-w-sm">
                Explore the discovery feed and save opportunities you're interested in.
             </p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {saved?.data?.map((bookmark: any) => (
              <OpportunityCard key={bookmark.id} opportunity={bookmark.opportunity} />
            ))}
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
