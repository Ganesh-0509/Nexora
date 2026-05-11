import { z } from "zod";
import { OpportunityType, OpportunityDifficulty } from "@prisma/client";

export const CreateOpportunitySchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().min(10),
  type: z.nativeEnum(OpportunityType),
  difficulty: z.nativeEnum(OpportunityDifficulty).default(OpportunityDifficulty.BEGINNER),
  companyId: z.string().cuid(),
  location: z.string().optional(),
  isRemote: z.boolean().default(false),
  deadline: z.string().datetime().optional(),
  stipend: z.string().optional(),
  prizePool: z.string().optional(),
  sourcePlatform: z.string().optional(),
  sourceUrl: z.string().url().optional(),
  skillsRequired: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type CreateOpportunityInput = z.infer<typeof CreateOpportunitySchema>;

export const OpportunityQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  type: z.nativeEnum(OpportunityType).optional(),
  difficulty: z.nativeEnum(OpportunityDifficulty).optional(),
  isRemote: z.preprocess((val) => val === "true" || val === true, z.boolean()).optional(),
  minStipend: z.preprocess((val) => val === "true" || val === true, z.boolean()).optional(),
  minPrizePool: z.preprocess((val) => val === "true" || val === true, z.boolean()).optional(),
  search: z.string().optional(),
  skills: z.preprocess((val) => (typeof val === "string" ? val.split(",") : val), z.array(z.string())).optional(),
  domains: z.preprocess((val) => (typeof val === "string" ? val.split(",") : val), z.array(z.string())).optional(),
  deadlineBefore: z.string().optional(),
});
