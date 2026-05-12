import { BaseAdapter } from "./base.adapter";
import { JobPageMetadata } from "@/lib/types";

export class GreenhouseAdapter extends BaseAdapter {
  platform = "greenhouse" as const;

  matches(url: string): boolean {
    return url.includes("boards.greenhouse.io") || url.includes("greenhouse.io/jobs");
  }

  isApplicationPage(): boolean {
    return !!document.querySelector("#application_form, form#application");
  }

  extractJobMetadata(): JobPageMetadata | null {
    try {
      const title = document.querySelector<HTMLElement>(".app-title, h1.job-title")?.innerText?.trim() || "";
      const company = document.querySelector<HTMLElement>(".company-name, .company")?.innerText?.trim()
        || document.title.split(" at ")[1]?.trim()
        || "";
      const location = document.querySelector<HTMLElement>(".location")?.innerText?.trim() || "";
      const isRemote = /remote/i.test(location);
      const description = document.querySelector<HTMLElement>("#content, .content, .job-description")?.innerText?.trim() || "";

      return {
        title,
        company,
        location,
        isRemote,
        requiredSkills: [],
        description,
        applyUrl: window.location.href,
        platform: "greenhouse",
      };
    } catch {
      return null;
    }
  }
}

export class LeverAdapter extends BaseAdapter {
  platform = "lever" as const;

  matches(url: string): boolean {
    return url.includes("jobs.lever.co");
  }

  isApplicationPage(): boolean {
    return !!document.querySelector(".application-form, form[action*='lever']");
  }

  extractJobMetadata(): JobPageMetadata | null {
    try {
      const title = document.querySelector<HTMLElement>(".posting-headline h2")?.innerText?.trim() || "";
      const company = document.querySelector<HTMLElement>(".main-header-logo img")?.getAttribute("alt")?.trim()
        || window.location.hostname
        || "";
      const location = document.querySelector<HTMLElement>(".posting-categories .sort-by-location")?.innerText?.trim() || "";
      const isRemote = /remote/i.test(location);
      const description = document.querySelector<HTMLElement>(".posting-description")?.innerText?.trim() || "";

      return {
        title,
        company,
        location,
        isRemote,
        requiredSkills: [],
        description,
        applyUrl: window.location.href,
        platform: "lever",
      };
    } catch {
      return null;
    }
  }
}

export class GenericAdapter extends BaseAdapter {
  platform = "generic" as const;

  matches(_url: string): boolean {
    return true; // Fallback for all sites
  }

  isApplicationPage(): boolean {
    return !!document.querySelector("form");
  }

  extractJobMetadata(): JobPageMetadata | null {
    const title = document.querySelector<HTMLElement>("h1")?.innerText?.trim() || document.title;
    return {
      title,
      company: window.location.hostname.replace("www.", ""),
      isRemote: false,
      requiredSkills: [],
      description: "",
      applyUrl: window.location.href,
      platform: "generic",
    };
  }
}
