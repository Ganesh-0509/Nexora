"use client";

import { motion } from "framer-motion";
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Bookmark, 
  ArrowUpRight, 
  Clock,
  Sparkles,
  Zap
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState, useEffect } from "react";

import posthog from "posthog-js";

interface OpportunityCardProps {
  opportunity: any;
  isBookmarked?: boolean;
  onBookmarkToggle?: () => void;
}

export function OpportunityCard({ 
  opportunity, 
  isBookmarked = false,
  onBookmarkToggle 
}: OpportunityCardProps) {
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    const newBookmarked = !bookmarked;
    setBookmarked(newBookmarked);
    onBookmarkToggle?.();
    posthog.capture("opportunity_bookmark_toggled", {
      opportunity_id: opportunity.id,
      opportunity_title: opportunity.title,
      opportunity_type: opportunity.type,
      bookmarked: newBookmarked,
    });
  };

  const handleViewDetails = () => {
    posthog.capture("opportunity_view_details_clicked", {
      opportunity_id: opportunity.id,
      opportunity_title: opportunity.title,
      opportunity_type: opportunity.type,
      company: opportunity.company?.name,
    });
  };

  const difficultyColors: Record<string, string> = {
    BEGINNER: "bg-emerald-500/10 text-emerald-500",
    INTERMEDIATE: "bg-amber-500/10 text-amber-500",
    ADVANCED: "bg-rose-500/10 text-rose-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col p-6 rounded-3xl border border-border bg-card hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300"
    >
      {/* Top Section: Company & Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-muted/50 border border-border flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110 duration-300">
            {opportunity.company?.logoUrl ? (
              <img src={opportunity.company.logoUrl} alt={opportunity.company.name} className="h-full w-full object-cover" />
            ) : (
              <Building2 className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">
              {opportunity.company?.name || "Independent"}
            </h4>
            <div className="flex items-center text-[10px] text-muted-foreground mt-0.5">
              <Clock className="h-3 w-3 mr-1" />
              {isMounted ? `${formatDistanceToNow(new Date(opportunity.createdAt))} ago` : "Recently"}
            </div>
          </div>
        </div>
        <button
          onClick={handleBookmark}
          className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center border transition-all duration-300",
            bookmarked ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
          )}
        >
          <Bookmark className={cn("h-4 w-4", bookmarked && "fill-current")} />
        </button>
      </div>

      {/* Title & Type */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border-none">
            {opportunity.type}
          </Badge>
          {opportunity.isRemote && (
            <Badge variant="outline" className="rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border-border">
              Remote
            </Badge>
          )}
        </div>
        <Link href={`/opportunities/${opportunity.id}`} className="block" onClick={handleViewDetails}>
          <h3 className="text-xl font-bold font-outfit leading-tight group-hover:text-primary transition-colors">
            {opportunity.title}
          </h3>
        </Link>
        
        {/* Stats Row */}
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 mr-1.5" />
            {opportunity.location || "Remote"}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 mr-1.5" />
            Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
          </div>
        </div>

        {/* Skills Tags */}
        <div className="mt-5 flex flex-wrap gap-1.5">
          {opportunity.skillsRequired?.slice(0, 3).map((skill: any) => (
            <span key={skill.id} className="px-2 py-1 rounded-lg bg-muted/50 text-[10px] font-medium text-muted-foreground border border-border/50">
              {skill.name}
            </span>
          ))}
          {opportunity.skillsRequired?.length > 3 && (
            <span className="px-2 py-1 rounded-lg bg-muted/50 text-[10px] font-medium text-muted-foreground">
              +{opportunity.skillsRequired.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Bottom Section: Stipend & Action */}
      <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            {opportunity.type === "INTERNSHIP" ? "Stipend" : "Prize Pool"}
          </p>
          <p className="text-lg font-extrabold mt-0.5">
            {opportunity.stipend || opportunity.prizePool || "unpaid"}
          </p>
        </div>
        <Link href={`/opportunities/${opportunity.id}`} onClick={handleViewDetails}>
          <Button className="rounded-xl px-5 h-10 group/btn shadow-xl shadow-primary/5">
            View Details
            <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
          </Button>
        </Link>
      </div>

      {/* Match Score Badge (Premium Detail) */}
      {(opportunity.matchScore !== undefined || isMounted) && (
        <div className={cn(
          "absolute -top-3 right-8 px-3 py-1 rounded-full bg-background border border-border shadow-sm flex items-center gap-1.5 transition-all duration-500",
          opportunity.matchScore >= 80 ? "animate-pulse" : ""
        )}>
          <Zap className={cn(
            "h-3 w-3",
            opportunity.matchScore >= 80 ? "text-amber-500 fill-amber-500" : "text-primary"
          )} />
          <span className="text-[10px] font-bold">
            {opportunity.matchScore ? `${opportunity.matchScore}% Match` : "95% Match"}
          </span>
        </div>
      )}
    </motion.div>
  );
}
