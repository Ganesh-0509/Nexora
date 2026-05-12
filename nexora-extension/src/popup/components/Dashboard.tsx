import React, { useState } from "react";
import { UserProfile, JobPageMetadata } from "@/lib/types";

interface DashboardProps {
  profile: UserProfile;
  currentJob: JobPageMetadata | null;
}

function MatchRing({ score }: { score: number }) {
  const color = score >= 75 ? "#22c55e" : score >= 45 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ ...styles.matchRing, borderColor: color }}>
      <span style={{ ...styles.matchScore, color }}>{score}%</span>
      <span style={styles.matchLabel}>Match</span>
    </div>
  );
}

export function Dashboard({ profile, currentJob }: DashboardProps) {
  const [isAutofilling, setIsAutofilling] = useState(false);
  const [fillStatus, setFillStatus] = useState<"idle" | "success" | "error">("idle");

  const handleAutofill = () => {
    setIsAutofilling(true);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "TRIGGER_AUTOFILL" }, () => {
          setIsAutofilling(false);
          setFillStatus("success");
          setTimeout(() => setFillStatus("idle"), 2500);
        });
      }
    });
  };

  // Compute quick local match for display
  const matchScore = currentJob?.requiredSkills.length
    ? Math.round(
        (currentJob.requiredSkills.filter(s =>
          profile.skills.some(ps => ps.toLowerCase() === s.toLowerCase())
        ).length /
          currentJob.requiredSkills.length) *
          100
      )
    : 0;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.brand}>⚡ Nexora</div>
        <a href="https://nexora.app/dashboard" target="_blank" rel="noreferrer" style={styles.link}>
          Open App →
        </a>
      </div>

      {/* Profile Quick View */}
      <div style={styles.profileCard}>
        <div style={styles.avatar}>{profile.fullName[0]}</div>
        <div>
          <div style={styles.profileName}>{profile.fullName}</div>
          <div style={styles.profileSub}>{profile.email}</div>
        </div>
      </div>

      {/* Current Job Analysis */}
      {currentJob ? (
        <div style={styles.jobCard}>
          <div style={styles.jobMeta}>
            <div style={styles.jobTitle}>{currentJob.title}</div>
            <div style={styles.jobCompany}>{currentJob.company}</div>
          </div>
          {currentJob.requiredSkills.length > 0 && (
            <MatchRing score={matchScore} />
          )}
        </div>
      ) : (
        <div style={styles.noJob}>
          Navigate to a job listing to see match analysis.
        </div>
      )}

      {/* Actions */}
      <div style={styles.actions}>
        <button
          style={{ ...styles.btnPrimary, ...(isAutofilling ? styles.btnDisabled : {}) }}
          onClick={handleAutofill}
          disabled={isAutofilling}
        >
          {isAutofilling ? "Filling..." : fillStatus === "success" ? "✅ Done!" : "⚡ Autofill Form"}
        </button>
        <button
          style={styles.btnGhost}
          onClick={() => chrome.tabs.create({ url: "https://nexora.app/opportunities" })}
        >
          Browse Opportunities
        </button>
      </div>

      {/* Skills Snapshot */}
      <div style={styles.skillsSection}>
        <div style={styles.sectionTitle}>Your Top Skills</div>
        <div style={styles.tags}>
          {profile.skills.slice(0, 6).map(s => (
            <span key={s} style={styles.tag}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { background: "#0a0a0f", color: "#fff", minHeight: 480, display: "flex", flexDirection: "column" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" },
  brand: { fontWeight: 800, fontSize: 15, letterSpacing: -0.3 },
  link: { fontSize: 11, color: "#6366f1", textDecoration: "none" },
  profileCard: { display: "flex", alignItems: "center", gap: 12, margin: "16px 20px", padding: 14, background: "rgba(255,255,255,0.04)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" },
  avatar: { width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, flexShrink: 0 },
  profileName: { fontWeight: 700, fontSize: 14 },
  profileSub: { fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 },
  jobCard: { margin: "0 20px", padding: 14, background: "rgba(99,102,241,0.08)", borderRadius: 12, border: "1px solid rgba(99,102,241,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" },
  jobMeta: { flex: 1 },
  jobTitle: { fontWeight: 700, fontSize: 13, lineHeight: 1.3 },
  jobCompany: { fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 3 },
  matchRing: { width: 56, height: 56, borderRadius: "50%", border: "3px solid", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  matchScore: { fontWeight: 800, fontSize: 14, lineHeight: 1 },
  matchLabel: { fontSize: 9, color: "rgba(255,255,255,0.4)", marginTop: 2, textTransform: "uppercase" as const, letterSpacing: 0.5 },
  noJob: { margin: "0 20px", padding: 14, background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px dashed rgba(255,255,255,0.08)", fontSize: 12, color: "rgba(255,255,255,0.35)", textAlign: "center" as const },
  actions: { display: "flex", flexDirection: "column", gap: 8, padding: "16px 20px" },
  btnPrimary: { padding: "11px 16px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", boxShadow: "0 4px 16px rgba(99,102,241,0.35)" },
  btnGhost: { padding: "10px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 13, cursor: "pointer" },
  btnDisabled: { opacity: 0.5, cursor: "not-allowed" },
  skillsSection: { padding: "0 20px 20px" },
  sectionTitle: { fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase" as const, letterSpacing: 1, marginBottom: 8 },
  tags: { display: "flex", flexWrap: "wrap", gap: 5 },
  tag: { padding: "4px 9px", borderRadius: 6, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.65)", fontSize: 11, fontWeight: 600, border: "1px solid rgba(255,255,255,0.06)" },
};
