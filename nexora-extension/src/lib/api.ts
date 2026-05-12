import { storage } from "./storage";

const NEXORA_API_URL = "https://nexora.app/api/v1"; // Replace with production URL

/**
 * Authenticated API client for communicating with the Nexora backend.
 * Automatically injects the stored auth token.
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await storage.getAuthToken();

  const response = await fetch(`${NEXORA_API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  async getProfile() {
    return request<any>("/profile/me");
  },

  async syncProfile(data: any) {
    return request<any>("/profile/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async saveJob(opportunityId: string) {
    return request<any>("/bookmarks", {
      method: "POST",
      body: JSON.stringify({ opportunityId }),
    });
  },

  async generateCoverLetter(jobTitle: string, company: string, jobDescription: string) {
    return request<{ coverLetter: string }>("/ai/cover-letter", {
      method: "POST",
      body: JSON.stringify({ jobTitle, company, jobDescription }),
    });
  },

  async analyzeMatch(jobDescription: string, userSkills: string[]) {
    return request<{ score: number; matchedSkills: string[]; missingSkills: string[] }>(
      "/ai/match-analysis",
      {
        method: "POST",
        body: JSON.stringify({ jobDescription, userSkills }),
      }
    );
  },
};
