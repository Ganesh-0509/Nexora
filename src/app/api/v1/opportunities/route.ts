import { auth } from "@clerk/nextjs/server";
import { OpportunityService } from "@/server/services/opportunity.service";
import { OpportunityQuerySchema, CreateOpportunitySchema } from "@/server/validators/opportunity.validator";
import { ApiUtils } from "@/server/utils/api-response";
import { withErrorHandler } from "@/server/utils/with-error-handler";
import { NextRequest } from "next/server";

/**
 * GET /api/v1/opportunities
 * Fetch paginated and filtered opportunities
 */
export const GET = withErrorHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const query = OpportunityQuerySchema.parse(Object.fromEntries(searchParams));

  const { items, total } = await OpportunityService.getAllOpportunities(query);

  return ApiUtils.success(items, 200, {
    page: query.page,
    limit: query.limit,
    total,
  });
});

/**
 * POST /api/v1/opportunities
 * Create a new opportunity (Protected - Admin/Recruiter only logic could be added here)
 */
export const POST = withErrorHandler(async (req: NextRequest) => {
  const { userId } = await auth();
  
  if (!userId) {
    return ApiUtils.error("Unauthorized", 401);
  }

  const body = await req.json();
  const input = CreateOpportunitySchema.parse(body);

  const opportunity = await OpportunityService.createOpportunity(input);

  return ApiUtils.success(opportunity, 201);
});
