import { OpportunityType, OpportunityDifficulty } from "@prisma/client";

export interface ScrapedOpportunity {
  title: string;
  description: string;
  companyName: string;
  companyLogo?: string;
  type: OpportunityType;
  location?: string;
  isRemote: boolean;
  deadline?: Date;
  stipend?: string;
  prizePool?: string;
  sourcePlatform: string;
  sourceUrl: string;
  skillsRequired: string[];
  tags: string[];
  difficulty: OpportunityDifficulty;
  externalId: string; // Unique ID from the source platform
}

export abstract class BaseAdapter {
  abstract name: string;
  abstract opportunityType: OpportunityType;
  
  abstract scrape(): Promise<ScrapedOpportunity[]>;
  
  protected normalizeString(str: string): string {
    return str.trim().replace(/\s+/g, ' ');
  }
}
