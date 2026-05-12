"use client";

import { useQueryState, parseAsString } from "nuqs";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { useDebounce } from "use-debounce";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import posthog from "posthog-js";

export function SearchHeader() {
  const [search, setSearch] = useQueryState("search", parseAsString);
  const [sort, setSort] = useQueryState("sort", parseAsString.withDefault("recent"));
  const [localSearch, setLocalSearch] = useState(search || "");
  const [debouncedSearch] = useDebounce(localSearch, 500);
  const prevDebouncedSearch = useRef(debouncedSearch);

  useEffect(() => {
    setSearch(debouncedSearch || null);
    if (debouncedSearch && debouncedSearch !== prevDebouncedSearch.current) {
      posthog.capture("opportunities_searched", { query: debouncedSearch });
    }
    prevDebouncedSearch.current = debouncedSearch;
  }, [debouncedSearch, setSearch]);

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 w-full bg-background/80 backdrop-blur-md pb-6 sticky top-0 z-10">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <Input
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Search roles, companies, or keywords..."
          className="h-12 pl-12 pr-4 rounded-2xl border-border bg-card hover:border-primary/30 focus-visible:ring-primary/20 transition-all text-base"
        />
      </div>
      <div className="flex items-center gap-2 w-full md:w-auto">
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            posthog.capture("opportunities_sorted", { sort_by: e.target.value });
          }}
          className="h-12 px-4 rounded-2xl border border-border bg-card text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
        >
          <option value="recent">Newest First</option>
          <option value="deadline">Deadline (Soonest)</option>
          <option value="prize">Highest Prize</option>
        </select>
        <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl lg:hidden">
          <SlidersHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
