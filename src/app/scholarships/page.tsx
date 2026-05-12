"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { FilterSidebar } from "@/components/shared/filter-sidebar";
import { SearchHeader } from "@/components/shared/search-header";
import { InfiniteFeed } from "@/components/shared/infinite-feed";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function ScholarshipsPage() {
  return (
    <DashboardLayout>
      <NuqsAdapter>
        <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto">
          <aside className="hidden lg:block">
            <FilterSidebar />
          </aside>

          <div className="flex-1 min-w-0">
            <div className="mb-8">
              <h1 className="text-3xl font-bold font-outfit">Scholarships</h1>
              <p className="text-muted-foreground mt-2">Financial aid and merit-based programs to support your education.</p>
            </div>
            <SearchHeader />
            <div className="mt-4">
              <InfiniteFeed initialType="SCHOLARSHIP" />
            </div>
          </div>
        </div>
      </NuqsAdapter>
    </DashboardLayout>
  );
}
