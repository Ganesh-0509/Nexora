"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";

import { Bell, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/opportunities?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-16 border-b border-border bg-card/30 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-20 shrink-0">
          <div className="flex-1 flex items-center gap-4">
            <div className="relative flex-1 max-w-md hidden md:block">
              <form onSubmit={handleSearch}>
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search anything..." 
                  className="pl-9 h-9 bg-muted/50 border-none rounded-lg focus-visible:ring-1 focus-visible:ring-primary/20"
                />
              </form>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative" onClick={() => {}}>
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
            </Button>
            <div className="h-8 w-px bg-border mx-2" />
            <Button className="rounded-xl shadow-lg shadow-primary/10">Upgrade</Button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8 selection:bg-primary/10">
          {children}
        </div>
      </main>
    </div>
  );
}
