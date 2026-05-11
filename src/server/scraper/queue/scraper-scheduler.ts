import { scraperQueue } from "./scraper-queue";
import { Logger } from "@/server/utils/logger";

export class ScraperScheduler {
  static async scheduleAll() {
    Logger.info("Initializing Scraper Schedule...");

    // Schedule Devpost every 6 hours
    await scraperQueue.add(
      "scrape-devpost",
      { source: "Devpost" },
      {
        repeat: {
          pattern: "0 */6 * * *", // Every 6 hours
        },
        jobId: "devpost-job"
      }
    );

    // Schedule other sources here
    // await scraperQueue.add("scrape-linkedin", { source: "LinkedIn" }, { repeat: { pattern: "0 */12 * * *" } });

    Logger.info("Scraper Schedule Initialized.");
  }

  static async triggerNow(source: string) {
    await scraperQueue.add(`scrape-${source.toLowerCase()}-manual`, { source });
  }
}
