import { db } from "@/server/db";
import { OnboardingInput } from "../validators/onboarding.validator";

export class OnboardingService {
  static async completeOnboarding(clerkId: string, input: OnboardingInput) {
    let user = await db.user.findUnique({
      where: { clerkId },
      include: { profile: true },
    });

    if (!user) {
      // In a real app, this should be handled by a Webhook, but as a fallback:
      const { currentUser } = await import("@clerk/nextjs/server");
      const clerkUser = await currentUser();
      if (!clerkUser) throw new Error("Clerk user not found");

      user = await db.user.create({
        data: {
          clerkId,
          email: clerkUser.emailAddresses[0].emailAddress,
          username: clerkUser.username || clerkUser.firstName || "user",
        },
        include: { profile: true },
      });
    }

    const { skills, interests, ...profileData } = input;

    // Use a transaction to update user status and upsert profile with relations
    return db.$transaction(async (tx) => {
      // 1. Update user onboarding status
      await tx.user.update({
        where: { id: user.id },
        data: { onboardingCompleted: true },
      });

      // 2. Upsert profile and connect relations
      return tx.profile.upsert({
        where: { userId: user.id },
        create: {
          ...profileData,
          userId: user.id,
          skills: {
            connectOrCreate: skills.map((s) => ({
              where: { name: s },
              create: { name: s },
            })),
          },
          interests: {
            connectOrCreate: interests.map((i) => ({
              where: { name: i },
              create: { name: i },
            })),
          },
        },
        update: {
          ...profileData,
          skills: {
            set: [], // Clear existing
            connectOrCreate: skills.map((s) => ({
              where: { name: s },
              create: { name: s },
            })),
          },
          interests: {
            set: [],
            connectOrCreate: interests.map((i) => ({
              where: { name: i },
              create: { name: i },
            })),
          },
        },
      });
    });
  }
}
