import { db } from "@/server/db";
import { ScoringEngine } from "./scoring.engine";
import { Logger } from "@/server/utils/logger";

export class RecommendationService {
  /**
   * Generates a personalized feed for a user.
   * Logic: 
   * 1. Fetch relevant opportunities (broad filters)
   * 2. Score each opportunity against user profile
   * 3. Sort by overall match score
   * 4. Return top recommendations
   */
  static async getPersonalizedFeed(clerkId: string, limit = 20) {
    try {
      const user = await db.user.findUnique({
        where: { clerkId },
        include: {
          profile: {
            include: {
              skills: true,
              interests: true,
            }
          }
        }
      });

      if (!user || !user.profile) {
        // Fallback to trending/recent if no profile exists
        return db.opportunity.findMany({
          take: limit,
          orderBy: { createdAt: "desc" },
          include: { company: true, skillsRequired: true, tags: true }
        });
      }

      // Fetch a pool of opportunities to rank
      // In production, this would be optimized with vector search or pre-filtering
      const pool = await db.opportunity.findMany({
        take: 100,
        where: {
          deadline: { gte: new Date() },
        },
        include: {
          company: true,
          skillsRequired: true,
          tags: true,
        },
        orderBy: { createdAt: "desc" }
      });

      // Score and Rank
      const ranked = pool.map((opp: any) => {
        const scores = ScoringEngine.calculateMatch(user.profile, opp);
        return {
          ...opp,
          matchScore: scores.overall,
          matchDetails: scores
        };
      });

      // Sort by score and take the requested limit
      return ranked
        .sort((a: any, b: any) => b.matchScore - a.matchScore)
        .slice(0, limit);

    } catch (error) {
      Logger.error("Failed to generate personalized feed", error);
      throw error;
    }
  }

  /**
   * Finds opportunities similar to a specific one.
   */
  static async getSimilarOpportunities(opportunityId: string, limit = 5) {
    const original = await db.opportunity.findUnique({
      where: { id: opportunityId },
      include: { tags: true, skillsRequired: true }
    });

    if (!original) return [];

    const tagNames = original.tags.map((t: any) => t.name);
    
    return db.opportunity.findMany({
      where: {
        id: { not: opportunityId },
        deadline: { gte: new Date() },
        OR: [
          { tags: { some: { name: { in: tagNames } } } },
          { type: original.type }
        ]
      },
      take: limit,
      include: { company: true, skillsRequired: true, tags: true },
      orderBy: { createdAt: "desc" }
    });
  }
}
