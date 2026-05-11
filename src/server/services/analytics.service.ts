import { db } from "@/server/db";
import { ActivityType } from "@prisma/client";
import { Logger } from "@/server/utils/logger";

export class AnalyticsService {
  /**
   * Tracks a user interaction event.
   */
  static async trackEvent(params: {
    userId?: string;
    clerkId?: string;
    type: ActivityType;
    opportunityId?: string;
    metadata?: any;
  }) {
    try {
      let finalUserId = params.userId;

      if (!finalUserId && params.clerkId) {
        const user = await db.user.findUnique({ where: { clerkId: params.clerkId } });
        if (user) finalUserId = user.id;
      }

      if (!finalUserId) return;

      return db.userActivity.create({
        data: {
          userId: finalUserId,
          type: params.type,
          opportunityId: params.opportunityId,
          metadata: params.metadata || {},
        },
      });
    } catch (error) {
      Logger.error("Failed to track event", error);
    }
  }

  /**
   * Retrieves user engagement stats for the recommendation engine.
   */
  static async getUserContext(clerkId: string) {
    const user = await db.user.findUnique({
      where: { clerkId },
      include: {
        activities: {
          take: 50,
          orderBy: { createdAt: "desc" },
          include: { opportunity: true }
        }
      }
    });

    if (!user) return null;

    // Extract preferred categories based on history
    const viewHistory = user.activities.filter((a: any) => a.type === ActivityType.VIEW);
    // ... logic to aggregate interests from history
    
    return user;
  }
}
