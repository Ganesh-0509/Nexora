import { OpportunityRepository } from "../repositories/opportunity.repository";
import { CreateOpportunityInput } from "../validators/opportunity.validator";
import { Prisma } from "@prisma/client";

export class OpportunityService {
  static async getAllOpportunities(filters: {
    page: number;
    limit: number;
    type?: any;
    difficulty?: any;
    isRemote?: boolean;
    search?: string;
    skills?: string[];
    domains?: string[];
    minStipend?: boolean;
    minPrizePool?: boolean;
    deadlineBefore?: string;
  }) {
    const skip = (filters.page - 1) * filters.limit;
    
    const where: Prisma.OpportunityWhereInput = {
      ...(filters.type && { type: filters.type }),
      ...(filters.difficulty && { difficulty: filters.difficulty }),
      ...(filters.isRemote !== undefined && { isRemote: filters.isRemote }),
      ...(filters.minStipend && { stipend: { not: null, notIn: ["", "Unpaid", "None"] } }),
      ...(filters.minPrizePool && { prizePool: { not: null, notIn: ["", "0", "None"] } }),
      ...(filters.deadlineBefore && { deadline: { lte: new Date(filters.deadlineBefore) } }),
      ...(filters.skills && filters.skills.length > 0 && {
        skillsRequired: {
          some: { name: { in: filters.skills } }
        }
      }),
      ...(filters.domains && filters.domains.length > 0 && {
        tags: {
          some: { name: { in: filters.domains } }
        }
      }),
      ...(filters.search && {
        OR: [
          { title: { contains: filters.search, mode: "insensitive" } },
          { description: { contains: filters.search, mode: "insensitive" } },
          { company: { name: { contains: filters.search, mode: "insensitive" } } },
        ],
      }),
    };

    return OpportunityRepository.findMany({
      skip,
      take: filters.limit,
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  static async createOpportunity(input: CreateOpportunityInput) {
    const { skillsRequired, tags, ...rest } = input;

    const data: Prisma.OpportunityCreateInput = {
      ...rest,
      company: { connect: { id: input.companyId } },
      skillsRequired: {
        connectOrCreate: skillsRequired?.map((skill) => ({
          where: { name: skill },
          create: { name: skill },
        })),
      },
      tags: {
        connectOrCreate: tags?.map((tag) => ({
          where: { name: tag },
          create: { name: tag },
        })),
      },
    };

    // Remove companyId from rest as it's handled by company: { connect: ... }
    delete (data as any).companyId;

    return OpportunityRepository.create(data);
  }
}
