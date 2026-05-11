"use client";

import { useOpportunities } from "@/hooks/use-opportunities";
import { useQueryState, parseAsBoolean, parseAsString, parseAsArrayOf } from "nuqs";
import { OpportunityCard } from "./opportunity-card";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { Loader2, Sparkles, SearchX } from "lucide-react";
import { motion } from "framer-motion";

export function InfiniteFeed() {
  const [type] = useQueryState("type", parseAsString);
  const [remote] = useQueryState("remote", parseAsBoolean);
  const [paid] = useQueryState("paid", parseAsBoolean);
  const [search] = useQueryState("search", parseAsString);
  const [skills] = useQueryState("skills", parseAsArrayOf(parseAsString).withDefault([]));

  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
  } = useOpportunities({
    type: type || undefined,
    isRemote: remote || undefined,
    minStipend: paid || undefined,
    search: search || undefined,
    skills: skills.length > 0 ? skills : undefined,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 4, 5, 6].map((i) => (
          <div key={i} className="h-[280px] rounded-3xl bg-muted/50 animate-pulse border border-border" />
        ))}
      </div>
    );
  }

  if (status === "success" && data.pages[0].data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
          <SearchX className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-bold font-outfit">No opportunities found</h3>
        <p className="text-muted-foreground mt-2 max-w-sm">
          Try adjusting your filters or search keywords to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data?.pages.map((page) =>
          page.data.map((opportunity: any) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))
        )}
      </div>

      {/* Loading Indicator / Intersection Anchor */}
      <div ref={ref} className="py-12 flex justify-center">
        {isFetchingNextPage ? (
          <div className="flex items-center gap-2 text-muted-foreground font-medium">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading more opportunities...
          </div>
        ) : hasNextPage ? (
          <div className="h-4" />
        ) : (
          <div className="text-center text-muted-foreground text-sm font-medium border-t border-border pt-8 w-full">
            <Sparkles className="h-5 w-5 mx-auto mb-2 text-primary/50" />
            You've reached the end of the feed.
          </div>
        )}
      </div>
    </div>
  );
}
