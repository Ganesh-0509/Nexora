import { getAdapter } from "./adapters";
import { detectFormFields, autofillFields } from "@/lib/autofill";
import { storage } from "@/lib/storage";
import { ExtensionMessage, UserProfile, JobPageMetadata } from "@/lib/types";
import { injectOverlay, updateOverlay, removeOverlay } from "./overlay";

let currentJobMeta: JobPageMetadata | null = null;

// ── Initialization ──────────────────────────────────────────
async function initialize() {
  const adapter = getAdapter();

  if (!adapter.isApplicationPage() && adapter.platform !== "generic") {
    // On job listing pages — show the Nexora analysis panel
    currentJobMeta = adapter.extractJobMetadata();
    if (currentJobMeta) {
      const profile = await storage.getProfile();
      injectOverlay(currentJobMeta, profile);
    }
  }
}

// ── Listen for autofill trigger from popup / overlay ────────
chrome.runtime.onMessage.addListener(async (msg: ExtensionMessage) => {
  if (msg.type === "TRIGGER_AUTOFILL") {
    const profile = await storage.getProfile();
    if (!profile) {
      console.warn("[Nexora] No profile found. Please complete onboarding on nexora.app.");
      return;
    }
    const fields = detectFormFields();
    const filled = autofillFields(fields, profile);
    console.info(`[Nexora] Autofilled ${filled} field(s).`);
  }

  if (msg.type === "ANALYZE_JOB") {
    const adapter = getAdapter();
    const meta = adapter.extractJobMetadata();
    currentJobMeta = meta;
    chrome.runtime.sendMessage({ type: "ANALYSIS_RESULT", payload: meta });
  }
});

// ── Run initialization once the page is stable ──────────────
initialize();
