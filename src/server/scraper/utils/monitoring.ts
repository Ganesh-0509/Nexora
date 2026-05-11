import { db } from "@/server/db";
import { Logger } from "@/server/utils/logger";

export class ScraperMonitoring {
  static async logHealth(source: string, status: "success" | "failure", opportunitiesCount: number = 0, error?: string) {
    // In a real app, this might go to a separate table like `ScraperLogs`
    Logger.info(`[MONITOR] Source: ${source} | Status: ${status} | Count: ${opportunitiesCount} ${error ? `| Error: ${error}` : ""}`);
    
    // Future: Track success rate in DB to alert if a scraper is consistently failing
  }

  static async getStats() {
    const total = await db.opportunity.count();
    const platformStats = await db.opportunity.groupBy({
      by: ["sourcePlatform"],
      _count: true,
    });

    return {
      totalOpportunities: total,
      byPlatform: platformStats,
    };
  }
}
