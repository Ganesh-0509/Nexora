import { auth } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import { ApiUtils } from "@/server/utils/api-response";
import { withErrorHandler } from "@/server/utils/with-error-handler";
import { NextRequest } from "next/server";

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

  // Fetch upcoming deadlines for bookmarked opportunities or top recommendations
  const deadlines = await db.opportunity.findMany({
    where: {
      deadline: { gte: new Date() },
      OR: [
        { bookmarks: { some: { userId: user.id } } },
        // Could add more logic here for "recommended" deadlines
      ]
    },
    take: 5,
    orderBy: { deadline: "asc" },
    select: {
      id: true,
      title: true,
      type: true,
      deadline: true
    }
  });

  return ApiUtils.success(deadlines);
});
