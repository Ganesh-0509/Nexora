import { auth } from "@clerk/nextjs/server";
import { OnboardingService } from "@/server/services/onboarding.service";
import { OnboardingSchema } from "@/server/validators/onboarding.validator";
import { ApiUtils } from "@/server/utils/api-response";
import { withErrorHandler } from "@/server/utils/with-error-handler";
import { NextRequest } from "next/server";
import { getPostHogClient } from "@/lib/posthog-server";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return ApiUtils.error("Unauthorized", 401);
  }

  const body = await req.json();
  const input = OnboardingSchema.parse(body);

  const profile = await OnboardingService.completeOnboarding(clerkId, input);

  const posthog = getPostHogClient();
  posthog.capture({
    distinctId: clerkId,
    event: "onboarding_completed_server",
    properties: {
      experience_level: input.experienceLevel,
      skills_count: input.skills.length,
      preferred_domains: input.preferredDomains,
      preferred_roles: input.preferredRoles,
    },
  });
  posthog.identify({
    distinctId: clerkId,
    properties: {
      name: input.fullName,
      college: input.college,
      graduation_year: input.graduationYear,
      experience_level: input.experienceLevel,
    },
  });

  return ApiUtils.success(profile, 200);
});
