import { auth } from "@clerk/nextjs/server";
import { BookmarkService } from "@/server/services/bookmark.service";
import { ApiUtils } from "@/server/utils/api-response";
import { withErrorHandler } from "@/server/utils/with-error-handler";
import { NextRequest } from "next/server";
import { db } from "@/server/db";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const { userId: clerkId } = await auth();
  if (!clerkId) return ApiUtils.error("Unauthorized", 401);

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user) return ApiUtils.error("User not found", 404);

  const bookmarks = await BookmarkService.getBookmarks(user.id);
  return ApiUtils.success(bookmarks);
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const { userId: clerkId } = await auth();
  if (!clerkId) return ApiUtils.error("Unauthorized", 401);

  const { opportunityId } = await req.json();
  if (!opportunityId) return ApiUtils.error("Opportunity ID is required", 400);

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user) return ApiUtils.error("User not found", 404);

  const result = await BookmarkService.toggleBookmark(user.id, opportunityId);
  return ApiUtils.success(result);
});
