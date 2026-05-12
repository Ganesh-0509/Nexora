import { BaseAdapter } from "./base.adapter";
import { JobPageMetadata } from "@/lib/types";

export class LinkedInAdapter extends BaseAdapter {
  platform = "linkedin" as const;

  matches(url: string): boolean {
    return url.includes("linkedin.com/jobs");
  }

  isApplicationPage(): boolean {
    return !!document.querySelector(".jobs-easy-apply-modal, .jobs-apply-form");
  }

  extractJobMetadata(): JobPageMetadata | null {
    try {
      const title = document.querySelector<HTMLElement>(".job-details-jobs-unified-top-card__job-title")?.innerText?.trim()
        || document.querySelector<HTMLElement>("h1.topcard__title")?.innerText?.trim()
        || "";

      const company = document.querySelector<HTMLElement>(".job-details-jobs-unified-top-card__company-name")?.innerText?.trim()
        || document.querySelector<HTMLElement>(".topcard__org-name-link")?.innerText?.trim()
        || "";

      const locationEl = document.querySelector<HTMLElement>(".job-details-jobs-unified-top-card__primary-description-container");
      const location = locationEl?.innerText?.split("·")[0]?.trim() || "";
      const isRemote = /remote/i.test(location);

      const description = document.querySelector<HTMLElement>("#job-details")?.innerText?.trim() || "";
      const applyUrl = window.location.href;

      // Extract skills from criteria section
      const skillItems = document.querySelectorAll<HTMLElement>(".job-details-skill-match-status-list li");
      const requiredSkills = Array.from(skillItems).map(el => el.innerText.trim()).filter(Boolean);

      return { title, company, location, isRemote, requiredSkills, description, applyUrl, platform: "linkedin" };
    } catch {
      return null;
    }
  }
}
