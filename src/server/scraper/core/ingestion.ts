import { db } from "@/server/db";
import { ScrapedOpportunity } from "./types";
import { DeduplicationService } from "./deduplication";
import { Logger } from "@/server/utils/logger";
import { Prisma } from "@prisma/client";

export class DataIngestionService {
  static async ingest(opportunities: ScrapedOpportunity[]) {
    let newCount = 0;
    let duplicateCount = 0;

    for (const opp of opportunities) {
      try {
        const isDuplicate = await DeduplicationService.isDuplicate(opp);
        
        if (isDuplicate) {
          duplicateCount++;
          continue;
        }

        await db.$transaction(async (tx: Prisma.TransactionClient) => {
          // 1. Find or create company
          const company = await tx.company.upsert({
            where: { name: opp.companyName },
            update: { logoUrl: opp.companyLogo },
            create: {
              name: opp.companyName,
              logoUrl: opp.companyLogo,
            },
          });

          // 2. Create opportunity
          await tx.opportunity.create({
            data: {
              title: opp.title,
              description: opp.description,
              type: opp.type,
              difficulty: opp.difficulty,
              companyId: company.id,
              location: opp.location,
              isRemote: opp.isRemote,
              deadline: opp.deadline,
              stipend: opp.stipend,
              prizePool: opp.prizePool,
              sourcePlatform: opp.sourcePlatform,
              sourceUrl: opp.sourceUrl,
              skillsRequired: {
                connectOrCreate: opp.skillsRequired.map(skill => ({
                  where: { name: skill },
                  create: { name: skill }
                }))
              },
              tags: {
                connectOrCreate: opp.tags.map(tag => ({
                  where: { name: tag },
                  create: { name: tag }
                }))
              },
              metadata: {
                externalId: opp.externalId,
                ingestedAt: new Date().toISOString()
              }
            }
          });
        });

        newCount++;
      } catch (error) {
        Logger.error(`Failed to ingest opportunity: ${opp.title}`, error);
      }
    }

    Logger.info(`Ingestion complete: ${newCount} new, ${duplicateCount} duplicates skipped.`);
    return { newCount, duplicateCount };
  }
}
