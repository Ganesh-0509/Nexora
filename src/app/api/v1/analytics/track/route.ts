import { auth } from "@clerk/nextjs/server";
import { AnalyticsService } from "@/server/services/analytics.service";
import { ApiUtils } from "@/server/utils/api-response";
import { withErrorHandler } from "@/server/utils/with-error-handler";
import { NextRequest } from "next/server";
import { z } from "zod";
import { ActivityType } from "@prisma/client";

const TrackEventSchema = z.object({
  type: z.nativeEnum(ActivityType),
  opportunityId: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

/**
 * POST /api/v1/analytics/track
 * Tracks user interaction events.
 */
export const POST = withErrorHandler(async (req: NextRequest) => {
  const { userId: clerkId } = await auth();
  
  const body = await req.json();
  const { type, opportunityId, metadata } = TrackEventSchema.parse(body);

  await AnalyticsService.trackEvent({
    clerkId: clerkId || undefined,
    type,
    opportunityId,
    metadata,
  });

  return ApiUtils.success({ tracked: true });
});
