import { auth } from "@clerk/nextjs/server";
import { RecommendationService } from "@/server/services/recommendation.service";
import { ApiUtils } from "@/server/utils/api-response";
import { withErrorHandler } from "@/server/utils/with-error-handler";
import { NextRequest } from "next/server";

/**
 * GET /api/v1/recommendations/feed
 * Fetch personalized recommendations for the authenticated user.
 */
export const GET = withErrorHandler(async (req: NextRequest) => {
  const { userId: clerkId } = await auth();
  
  if (!clerkId) {
    return ApiUtils.error("Unauthorized", 401);
  }

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "20");

  const recommendations = await RecommendationService.getPersonalizedFeed(clerkId, limit);

  return ApiUtils.success(recommendations);
});
