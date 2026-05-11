import type { Metadata } from "next";

const APP_URL = "https://nexora.app";
const SITE_NAME = "Nexora";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Nexora — AI-Powered Student Opportunity Platform",
    template: "%s | Nexora",
  },
  description:
    "Discover personalized hackathons, internships, and career opportunities tailored to your skills. AI-powered matching for students and freshers.",
  keywords: [
    "hackathons for students",
    "internships india",
    "student opportunities",
    "fresher jobs",
    "coding internships",
    "AI career platform",
    "college students opportunities",
  ],
  authors: [{ name: "Nexora" }],
  creator: "Nexora",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "Nexora — AI-Powered Student Opportunity Platform",
    description:
      "Discover personalized hackathons, internships, and career opportunities tailored to your skills.",
    url: APP_URL,
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Nexora — Opportunities for Students",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexora — AI Opportunity Platform for Students",
    description: "Personalized hackathons, internships & career events. Built for college students.",
    images: [`${APP_URL}/og-image.png`],
    creator: "@nexoraapp",
  },
  alternates: {
    canonical: APP_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export function generateOpportunityMetadata(opp: {
  title: string;
  company?: { name: string };
  description?: string;
  deadline?: Date;
  type: string;
}): Metadata {
  const title = `${opp.title} at ${opp.company?.name || "Unknown"}`;
  const description = opp.description?.slice(0, 160) || `Apply to ${opp.title} — a ${opp.type} opportunity on Nexora.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Nexora`,
      description,
      type: "article",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}
