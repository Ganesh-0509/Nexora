"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

// ── Initialise once (client-side only) ────────────────────
if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
    capture_pageview: false, // Next.js handles routing — we fire manually
    capture_pageleave: true,
    loaded(ph) {
      if (process.env.NODE_ENV === "development") ph.debug();
    },
  });
}

// ── Identify authenticated users ──────────────────────────
function PostHogIdentifier() {
  const { userId } = useAuth();
  const ph = usePostHog();

  useEffect(() => {
    if (userId) {
      ph.identify(userId);
    } else {
      ph.reset();
    }
  }, [userId, ph]);

  return null;
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider client={posthog}>
      <PostHogIdentifier />
      {children}
    </PHProvider>
  );
}

// ── Typed event tracker for use across the app ────────────
export const analytics = {
  track(event: string, properties?: Record<string, unknown>) {
    posthog.capture(event, properties);
  },

  page(url: string) {
    posthog.capture("$pageview", { $current_url: url });
  },
};
