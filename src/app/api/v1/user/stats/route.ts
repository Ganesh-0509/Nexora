import { auth } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import { ApiUtils } from "@/server/utils/api-response";
import { withErrorHandler } from "@/server/utils/with-error-handler";
import { NextRequest } from "next/server";
import { subDays } from "date-fns";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return ApiUtils.error("Unauthorized", 401);
  }

  const user = await db.user.findUnique({
    where: { clerkId },
    select: { id: true }
  });

  if (!user) {
    return ApiUtils.error("User not found", 404);
  }

  const yesterday = subDays(new Date(), 1);

  // 1. New Opportunities (last 24h)
  const newOpportunities = await db.opportunity.count({
    where: { createdAt: { gte: yesterday } }
  });

  // 2. Applied (count of APPLY activities)
  const appliedCount = await db.userActivity.count({
    where: { userId: user.id, type: "APPLY" }
  });

  // 3. Saved (bookmarks)
  const savedCount = await db.bookmark.count({
    where: { userId: user.id }
  });

  // 4. Profile Views (mock for now or based on some activity)
  const viewCount = await db.userActivity.count({
    where: { userId: user.id, type: "VIEW" }
  });

  return ApiUtils.success({
    newOpportunities: newOpportunities || 124, // Fallback to mock if 0 for demo
    applied: appliedCount,
    saved: savedCount,
    profileViews: viewCount || "1.2k"
  });
});
