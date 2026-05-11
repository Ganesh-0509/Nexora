"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { FilterSidebar } from "@/components/shared/filter-sidebar";
import { SearchHeader } from "@/components/shared/search-header";
import { InfiniteFeed } from "@/components/shared/infinite-feed";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function OpportunitiesPage() {
  return (
    <DashboardLayout>
      <NuqsAdapter>
        <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto">
          {/* Left: Filter Sidebar */}
          <aside className="hidden lg:block">
            <FilterSidebar />
          </aside>

          {/* Right: Search & Feed */}
          <div className="flex-1 min-w-0">
            <SearchHeader />
            <div className="mt-4">
              <InfiniteFeed />
            </div>
          </div>
        </div>
      </NuqsAdapter>
    </DashboardLayout>
  );
}
