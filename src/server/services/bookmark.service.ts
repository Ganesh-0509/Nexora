import { db } from "@/server/db";
import { ApiUtils } from "../utils/api-response";

export class BookmarkService {
  static async toggleBookmark(userId: string, opportunityId: string) {
    const existing = await db.bookmark.findUnique({
      where: {
        userId_opportunityId: {
          userId,
          opportunityId,
        },
      },
    });

    if (existing) {
      await db.bookmark.delete({
        where: { id: existing.id },
      });
      return { bookmarked: false };
    }

    await db.bookmark.create({
      data: {
        userId,
        opportunityId,
      },
    });

    return { bookmarked: true };
  }

  static async getBookmarks(userId: string) {
    return db.bookmark.findMany({
      where: { userId },
      include: {
        opportunity: {
          include: {
            company: true,
            skillsRequired: true,
            tags: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
