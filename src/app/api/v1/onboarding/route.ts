import { auth } from "@clerk/nextjs/server";
import { OnboardingService } from "@/server/services/onboarding.service";
import { OnboardingSchema } from "@/server/validators/onboarding.validator";
import { ApiUtils } from "@/server/utils/api-response";
import { withErrorHandler } from "@/server/utils/with-error-handler";
import { NextRequest } from "next/server";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return ApiUtils.error("Unauthorized", 401);
  }

  const body = await req.json();
  const input = OnboardingSchema.parse(body);

  const profile = await OnboardingService.completeOnboarding(clerkId, input);

  return ApiUtils.success(profile, 200);
});
