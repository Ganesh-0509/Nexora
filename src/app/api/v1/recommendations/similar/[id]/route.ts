import { RecommendationService } from "@/server/services/recommendation.service";
import { ApiUtils } from "@/server/utils/api-response";
import { withErrorHandler } from "@/server/utils/with-error-handler";
import { NextRequest } from "next/server";

/**
 * GET /api/v1/recommendations/similar/:id
 * Fetch similar opportunities based on tags and type.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withErrorHandler(async () => {
    const { id } = params;
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "5");

    const similar = await RecommendationService.getSimilarOpportunities(id, limit);

    return ApiUtils.success(similar);
  })();
}
