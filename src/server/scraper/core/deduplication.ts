import { db } from "@/server/db";
import { ScrapedOpportunity } from "./types";
import { Logger } from "@/server/utils/logger";

export class DeduplicationService {
  /**
   * Checks if an opportunity already exists in the database.
   * Priority 1: Exact Source URL match
   * Priority 2: Fuzzy match (Same Title + Same Company + Similar Deadline)
   */
  static async isDuplicate(opportunity: ScrapedOpportunity): Promise<boolean> {
    // 1. Check by Source URL (Most reliable)
    const existingByUrl = await db.opportunity.findFirst({
      where: { sourceUrl: opportunity.sourceUrl },
    });

    if (existingByUrl) return true;

    // 2. Check by Title and Company Name
    const existingByTitle = await db.opportunity.findFirst({
      where: {
        title: { equals: opportunity.title, mode: 'insensitive' },
        company: { name: { equals: opportunity.companyName, mode: 'insensitive' } },
        type: opportunity.type,
      },
    });

    if (existingByTitle) {
      // If title and company match, check if deadlines are reasonably close (within 2 days)
      if (!opportunity.deadline || !existingByTitle.deadline) return true;
      
      const timeDiff = Math.abs(opportunity.deadline.getTime() - existingByTitle.deadline.getTime());
      const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
      
      if (timeDiff < twoDaysInMs) return true;
    }

    return false;
  }
}
