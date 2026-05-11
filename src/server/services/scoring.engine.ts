export interface MatchScores {
  overall: number;
  skillsMatch: number;
  roleMatch: number;
  domainMatch: number;
  experienceMatch: number;
  locationMatch: number;
}

export class ScoringEngine {
  /**
   * Calculates the match score between a user profile and an opportunity.
   * Scores are normalized between 0 and 100.
   */
  static calculateMatch(userProfile: any, opportunity: any): MatchScores {
    const weights = {
      skills: 0.4,
      roles: 0.25,
      domains: 0.15,
      experience: 0.1,
      location: 0.1,
    };

    // 1. Skills Match (Intersection / Opportunity Skills)
    const userSkills = new Set(userProfile.skills?.map((s: any) => s.name.toLowerCase()) || []);
    const oppSkills = opportunity.skillsRequired?.map((s: any) => s.name.toLowerCase()) || [];
    
    let skillsScore = 0;
    if (oppSkills.length > 0) {
      const matchedSkills = oppSkills.filter((s: string) => userSkills.has(s));
      skillsScore = (matchedSkills.length / oppSkills.length) * 100;
    } else {
      skillsScore = 80; // Default if no specific skills required
    }

    // 2. Roles Match
    const preferredRoles = new Set(userProfile.preferredRoles?.map((r: string) => r.toLowerCase()) || []);
    const oppTitle = opportunity.title.toLowerCase();
    const roleMatch = Array.from(preferredRoles).some(role => oppTitle.includes(role)) ? 100 : 0;

    // 3. Domain/Tag Match
    const preferredDomains = new Set(userProfile.preferredDomains?.map((d: string) => d.toLowerCase()) || []);
    const oppTags = new Set(opportunity.tags?.map((t: any) => t.name.toLowerCase()) || []);
    const matchedDomains = Array.from(preferredDomains).filter(d => oppTags.has(d));
    const domainScore = preferredDomains.size > 0 ? (matchedDomains.length / preferredDomains.size) * 100 : 50;

    // 4. Experience Match
    const userLevel = userProfile.experienceLevel?.toUpperCase() || "BEGINNER";
    const oppDifficulty = opportunity.difficulty || "BEGINNER";
    const experienceScore = userLevel === oppDifficulty ? 100 : (userLevel === "ADVANCED" ? 70 : 40);

    // 5. Location Match
    let locationScore = 0;
    if (opportunity.isRemote) {
      locationScore = userProfile.remotePreference === "Remote" || userProfile.remotePreference === "Hybrid" ? 100 : 70;
    } else {
      const preferredLocations = new Set(userProfile.preferredLocations?.map((l: string) => l.toLowerCase()) || []);
      locationScore = preferredLocations.has(opportunity.location?.toLowerCase()) ? 100 : 0;
    }

    const overall = Math.round(
      skillsScore * weights.skills +
      roleMatch * weights.roles +
      domainScore * weights.domains +
      experienceScore * weights.experience +
      locationScore * weights.location
    );

    return {
      overall,
      skillsMatch: Math.round(skillsScore),
      roleMatch,
      domainMatch: Math.round(domainScore),
      experienceMatch: experienceScore,
      locationMatch: locationScore,
    };
  }
}
