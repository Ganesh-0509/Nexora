"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { FilterSidebar } from "@/components/shared/filter-sidebar";
import { SearchHeader } from "@/components/shared/search-header";
import { InfiniteFeed } from "@/components/shared/infinite-feed";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function EventsPage() {
  return (
    <DashboardLayout>
      <NuqsAdapter>
        <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto">
          <aside className="hidden lg:block">
            <FilterSidebar />
          </aside>

          <div className="flex-1 min-w-0">
            <div className="mb-8">
              <h1 className="text-3xl font-bold font-outfit">Tech Events</h1>
              <p className="text-muted-foreground mt-2">Discover upcoming conferences, workshops, and meetups.</p>
            </div>
            <SearchHeader />
            <div className="mt-4">
              <InfiniteFeed initialType="EVENT" />
            </div>
          </div>
        </div>
      </NuqsAdapter>
    </DashboardLayout>
  );
}
