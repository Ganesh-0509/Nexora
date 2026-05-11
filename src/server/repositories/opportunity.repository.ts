import { db } from "@/server/db";
import { Prisma } from "@prisma/client";

export class OpportunityRepository {
  private static model = db.opportunity;

  static async findById(id: string) {
    return this.model.findUnique({
      where: { id },
      include: {
        company: true,
        skillsRequired: true,
        tags: true,
      },
    });
  }

  static async findMany(params: {
    skip: number;
    take: number;
    where?: Prisma.OpportunityWhereInput;
    orderBy?: Prisma.OpportunityOrderByWithRelationInput;
  }) {
    const [items, total] = await Promise.all([
      this.model.findMany({
        ...params,
        include: {
          company: true,
          skillsRequired: true,
          tags: true,
        },
      }),
      this.model.count({ where: params.where }),
    ]);

    return { items, total };
  }

  static async create(data: Prisma.OpportunityCreateInput) {
    return this.model.create({
      data,
      include: {
        company: true,
        skillsRequired: true,
        tags: true,
      },
    });
  }

  static async update(id: string, data: Prisma.OpportunityUpdateInput) {
    return this.model.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return this.model.delete({
      where: { id },
    });
  }
}
