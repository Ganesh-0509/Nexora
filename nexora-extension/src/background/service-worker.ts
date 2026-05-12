import { ExtensionMessage } from "@/lib/types";
import { storage } from "@/lib/storage";
import { api } from "@/lib/api";

// ── On Install: set defaults ─────────────────────────────────
chrome.runtime.onInstalled.addListener(async () => {
  console.info("[Nexora BG] Extension installed.");
});

// ── Central Message Router ────────────────────────────────────
chrome.runtime.onMessage.addListener((msg: ExtensionMessage, _sender, sendResponse) => {
  handleMessage(msg).then(sendResponse).catch(err => sendResponse({ error: err.message }));
  return true; // Keep port open for async response
});

async function handleMessage(msg: ExtensionMessage): Promise<any> {
  switch (msg.type) {
    case "GET_PROFILE": {
      // First try local cache, then fetch from API
      let profile = await storage.getProfile();
      if (!profile) {
        const token = await storage.getAuthToken();
        if (token) {
          const result = await api.getProfile();
          profile = result.data;
          if (profile) await storage.setProfile(profile);
        }
      }
      return { type: "PROFILE_DATA", payload: profile };
    }

    case "SAVE_JOB": {
      const { opportunityId, url, title } = msg.payload || {};
      if (opportunityId) {
        await api.saveJob(opportunityId);
      } else {
        // Locally save if no platform ID is available yet
        const currentJobs = await storage.getSavedJobs();
        await chrome.storage.local.set({ nexora_saved_jobs: [...currentJobs, { url, title, savedAt: Date.now() }] });
      }
      return { type: "JOB_SAVED" };
    }

    case "GENERATE_COVER_LETTER": {
      const { jobTitle, company, jobDescription } = msg.payload || {};
      const result = await api.generateCoverLetter(jobTitle, company, jobDescription);
      return { type: "COVER_LETTER_RESULT", payload: result };
    }

    case "ANALYZE_JOB": {
      const { jobDescription } = msg.payload || {};
      const profile = await storage.getProfile();
      if (!profile) return { type: "ANALYSIS_RESULT", payload: null };
      const result = await api.analyzeMatch(jobDescription, profile.skills);
      return { type: "ANALYSIS_RESULT", payload: result };
    }

    case "SYNC_SESSION": {
      // Called from popup after user logs in on nexora.app
      const { token } = msg.payload || {};
      if (token) await storage.setAuthToken(token);
      return { type: "AUTH_STATUS", payload: { authenticated: !!token } };
    }

    default:
      return null;
  }
}
