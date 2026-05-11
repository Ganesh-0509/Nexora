import { chromium, Browser } from "playwright";
import { BaseAdapter, ScrapedOpportunity } from "../core/types";
import { OpportunityType, OpportunityDifficulty } from "@prisma/client";
import { Logger } from "@/server/utils/logger";

export class DevpostAdapter extends BaseAdapter {
  name = "Devpost";
  opportunityType = OpportunityType.HACKATHON;
  private url = "https://devpost.com/hackathons";

  async scrape(): Promise<ScrapedOpportunity[]> {
    let browser: Browser | null = null;
    const opportunities: ScrapedOpportunity[] = [];

    try {
      browser = await chromium.launch({ headless: true });
      const page = await browser.newPage();
      
      // Navigate to Devpost hackathons page
      await page.goto(this.url, { waitUntil: "networkidle" });

      // Wait for the hackathon cards to load
      await page.waitForSelector(".hackathon-tile");

      // Extract data from the page
      const hackathons = await page.$$eval(".hackathon-tile", (tiles) => {
        return (tiles as HTMLElement[]).map(tile => {
          const title = (tile.querySelector("h3") as HTMLElement)?.innerText || "";
          const url = (tile.querySelector("a") as HTMLAnchorElement)?.href || "";
          const organizer = (tile.querySelector(".organizer") as HTMLElement)?.innerText || "Unknown Organizer";
          const prize = (tile.querySelector(".prize-amount") as HTMLElement)?.innerText || "";
          
          return {
            title,
            url,
            company: organizer,
            stipendInfo: prize,
            externalId: url.split('/').pop() || Math.random().toString()
          };
        });
      });

      for (const hk of hackathons) {
        opportunities.push({
          title: this.normalizeString(hk.title),
          description: "Discover this hackathon on Devpost.", // Detailed scraping would happen here
          companyName: hk.company,
          type: OpportunityType.HACKATHON,
          isRemote: true, // Most Devpost hackathons are remote/global
          sourcePlatform: this.name,
          sourceUrl: hk.url,
          externalId: hk.externalId,
          difficulty: OpportunityDifficulty.BEGINNER,
          skillsRequired: [], // Enrichment would happen here
          tags: ["Hackathon", "Coding"],
          prizePool: hk.stipendInfo,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Placeholder
        });
      }

    } catch (error) {
      Logger.error(`[${this.name}] Scraping failed`, error);
    } finally {
      if (browser) await browser.close();
    }

    return opportunities;
  }
}
