import { UserProfile } from "./types";

const STORAGE_KEYS = {
  PROFILE: "nexora_profile",
  AUTH_TOKEN: "nexora_auth_token",
  SAVED_JOBS: "nexora_saved_jobs",
  SETTINGS: "nexora_settings",
} as const;

/**
 * Typed wrapper around chrome.storage.local.
 * Provides a clean API for getting/setting extension state.
 */
export const storage = {
  async getProfile(): Promise<UserProfile | null> {
    const result = await chrome.storage.local.get(STORAGE_KEYS.PROFILE);
    return result[STORAGE_KEYS.PROFILE] ?? null;
  },

  async setProfile(profile: UserProfile): Promise<void> {
    await chrome.storage.local.set({ [STORAGE_KEYS.PROFILE]: profile });
  },

  async getAuthToken(): Promise<string | null> {
    const result = await chrome.storage.local.get(STORAGE_KEYS.AUTH_TOKEN);
    return result[STORAGE_KEYS.AUTH_TOKEN] ?? null;
  },

  async setAuthToken(token: string): Promise<void> {
    await chrome.storage.local.set({ [STORAGE_KEYS.AUTH_TOKEN]: token });
  },

  async clearAuthToken(): Promise<void> {
    await chrome.storage.local.remove(STORAGE_KEYS.AUTH_TOKEN);
  },

  async getSavedJobs(): Promise<string[]> {
    const result = await chrome.storage.local.get(STORAGE_KEYS.SAVED_JOBS);
    return result[STORAGE_KEYS.SAVED_JOBS] ?? [];
  },

  async saveJob(jobId: string): Promise<void> {
    const current = await storage.getSavedJobs();
    if (!current.includes(jobId)) {
      await chrome.storage.local.set({ [STORAGE_KEYS.SAVED_JOBS]: [...current, jobId] });
    }
  },
};
