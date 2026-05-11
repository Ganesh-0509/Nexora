"use client";

import * as React from "react";
import { useQueryState, parseAsBoolean, parseAsString, parseAsArrayOf } from "nuqs";
import { 
  Filter, 
  X, 
  ChevronDown, 
  Briefcase, 
  GraduationCap, 
  Globe, 
  Zap,
  DollarSign,
  Trophy,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MultiSelect } from "@/components/ui/multi-select";

const OPPORTUNITY_TYPES = [
  { label: "Internships", value: "INTERNSHIP" },
  { label: "Hackathons", value: "HACKATHON" },
  { label: "Placement", value: "PLACEMENT" },
  { label: "Events", value: "EVENT" },
];

const SKILLS = [
  { label: "React", value: "react" },
  { label: "Python", value: "python" },
  { label: "TypeScript", value: "typescript" },
  { label: "UI/UX", value: "ui_ux" },
  { label: "Node.js", value: "nodejs" },
];

export function FilterSidebar() {
  const [type, setType] = useQueryState("type", parseAsString);
  const [isRemote, setIsRemote] = useQueryState("remote", parseAsBoolean);
  const [minStipend, setMinStipend] = useQueryState("paid", parseAsBoolean);
  const [skills, setSkills] = useQueryState("skills", parseAsArrayOf(parseAsString).withDefault([]));

  const resetFilters = () => {
    setType(null);
    setIsRemote(null);
    setMinStipend(null);
    setSkills([]);
  };

  const activeCount = [type, isRemote, minStipend, skills.length > 0].filter(Boolean).length;

  return (
    <div className="w-full lg:w-72 space-y-8 sticky top-24 h-fit pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold font-outfit">Filters</h3>
          {activeCount > 0 && (
            <Badge variant="secondary" className="rounded-full px-2 h-5">
              {activeCount}
            </Badge>
          )}
        </div>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs h-8">
            Reset
          </Button>
        )}
      </div>

      <div className="space-y-8">
        {/* Opportunity Type */}
        <div className="space-y-4">
          <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
             <GraduationCap className="h-4 w-4" />
             Opportunity Type
          </Label>
          <div className="grid grid-cols-1 gap-2">
            {OPPORTUNITY_TYPES.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setType(type === opt.value ? null : opt.value)}
                className={cn(
                  "flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-medium transition-all text-left",
                  type === opt.value ? "bg-primary/10 border-primary text-primary" : "bg-card border-border hover:border-primary/50"
                )}
              >
                {opt.label}
                {type === opt.value && <X className="h-3 w-3" />}
              </button>
            ))}
          </div>
        </div>

        {/* Remote / Paid */}
        <div className="space-y-4">
           <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Quick Filters
           </Label>
           <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:border-primary/30 cursor-pointer group">
                 <input 
                    type="checkbox" 
                    checked={isRemote || false} 
                    onChange={(e) => setIsRemote(e.target.checked ? true : null)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                 />
                 <span className="text-sm font-medium group-hover:text-primary transition-colors flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Remote Only
                 </span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:border-primary/30 cursor-pointer group">
                 <input 
                    type="checkbox" 
                    checked={minStipend || false} 
                    onChange={(e) => setMinStipend(e.target.checked ? true : null)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                 />
                 <span className="text-sm font-medium group-hover:text-primary transition-colors flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Paid Opportunities
                 </span>
              </label>
           </div>
        </div>

        {/* Skills */}
        <div className="space-y-4">
           <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Desired Skills
           </Label>
           <MultiSelect 
              options={SKILLS} 
              selected={skills} 
              onChange={setSkills} 
              placeholder="Search skills..."
           />
        </div>
      </div>
    </div>
  );
}
