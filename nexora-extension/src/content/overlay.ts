import { JobPageMetadata, MatchAnalysis, UserProfile } from "@/lib/types";

const OVERLAY_ID = "nexora-overlay-root";

function calculateLocalMatch(meta: JobPageMetadata, profile: UserProfile | null): MatchAnalysis {
  if (!profile || !meta.requiredSkills.length) {
    return { score: 0, matchedSkills: [], missingSkills: meta.requiredSkills, suggestions: [] };
  }
  const userSkillsLower = new Set(profile.skills.map(s => s.toLowerCase()));
  const matched = meta.requiredSkills.filter(s => userSkillsLower.has(s.toLowerCase()));
  const missing = meta.requiredSkills.filter(s => !userSkillsLower.has(s.toLowerCase()));
  const score = Math.round((matched.length / meta.requiredSkills.length) * 100);
  return { score, matchedSkills: matched, missingSkills: missing, suggestions: [] };
}

function getScoreColor(score: number): string {
  if (score >= 75) return "#22c55e";
  if (score >= 45) return "#f59e0b";
  return "#ef4444";
}

/**
 * Injects the non-intrusive side-panel overlay into the current job listing page.
 */
export function injectOverlay(meta: JobPageMetadata, profile: UserProfile | null) {
  if (document.getElementById(OVERLAY_ID)) return; // Already injected

  const match = calculateLocalMatch(meta, profile);

  const root = document.createElement("div");
  root.id = OVERLAY_ID;

  root.innerHTML = `
    <div class="nxr-panel">
      <div class="nxr-header">
        <span class="nxr-logo">⚡ Nexora</span>
        <button class="nxr-close" id="nxr-close-btn">✕</button>
      </div>

      <div class="nxr-body">
        <div class="nxr-job-title">${meta.title}</div>
        <div class="nxr-company">${meta.company}</div>

        <div class="nxr-score-wrap">
          <div class="nxr-score-label">Resume Match</div>
          <div class="nxr-score-value" style="color: ${getScoreColor(match.score)}">
            ${match.score > 0 ? `${match.score}%` : "—"}
          </div>
        </div>

        ${match.matchedSkills.length > 0 ? `
          <div class="nxr-section">
            <div class="nxr-section-title">✅ Matched Skills</div>
            <div class="nxr-tags">
              ${match.matchedSkills.slice(0, 5).map(s => `<span class="nxr-tag nxr-tag-match">${s}</span>`).join("")}
            </div>
          </div>
        ` : ""}

        ${match.missingSkills.length > 0 ? `
          <div class="nxr-section">
            <div class="nxr-section-title">⚠️ Missing Skills</div>
            <div class="nxr-tags">
              ${match.missingSkills.slice(0, 4).map(s => `<span class="nxr-tag nxr-tag-miss">${s}</span>`).join("")}
            </div>
          </div>
        ` : ""}
      </div>

      <div class="nxr-footer">
        <button class="nxr-btn nxr-btn-ghost" id="nxr-save-btn">🔖 Save Job</button>
        <button class="nxr-btn nxr-btn-primary" id="nxr-autofill-btn">⚡ Autofill</button>
      </div>
    </div>
  `;

  document.body.appendChild(root);

  // Event Listeners
  document.getElementById("nxr-close-btn")?.addEventListener("click", removeOverlay);
  document.getElementById("nxr-autofill-btn")?.addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "TRIGGER_AUTOFILL" });
  });
  document.getElementById("nxr-save-btn")?.addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "SAVE_JOB", payload: { url: meta.applyUrl, title: meta.title } });
    const btn = document.getElementById("nxr-save-btn");
    if (btn) btn.innerText = "✅ Saved!";
  });
}

export function updateOverlay(match: MatchAnalysis) {
  const scoreEl = document.querySelector<HTMLElement>(".nxr-score-value");
  if (scoreEl) {
    scoreEl.style.color = getScoreColor(match.score);
    scoreEl.innerText = `${match.score}%`;
  }
}

export function removeOverlay() {
  document.getElementById(OVERLAY_ID)?.remove();
}
