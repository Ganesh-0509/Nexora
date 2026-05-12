import React from "react";

export function LoginPrompt() {
  return (
    <div style={styles.container}>
      <div style={styles.icon}>⚡</div>
      <h1 style={styles.title}>Nexora Assistant</h1>
      <p style={styles.subtitle}>
        Sign in to your Nexora account to enable autofill, match analysis, and AI-powered application assistance.
      </p>
      <button
        style={styles.btn}
        onClick={() => chrome.tabs.create({ url: "https://nexora.app/sign-in" })}
      >
        Sign In to Nexora →
      </button>
      <p style={styles.note}>
        Don't have an account?{" "}
        <a href="https://nexora.app/sign-up" target="_blank" rel="noreferrer" style={styles.link} onClick={() => chrome.tabs.create({ url: "https://nexora.app/sign-up" })}>
          Create one free
        </a>
      </p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { background: "#0a0a0f", color: "#fff", minHeight: 480, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px", textAlign: "center" },
  icon: { fontSize: 48, marginBottom: 16, filter: "drop-shadow(0 0 16px rgba(99,102,241,0.6))" },
  title: { fontSize: 22, fontWeight: 800, letterSpacing: -0.5, marginBottom: 12 },
  subtitle: { fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 28, maxWidth: 260 },
  btn: { width: "100%", padding: "12px 20px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 6px 20px rgba(99,102,241,0.4)", marginBottom: 16 },
  note: { fontSize: 12, color: "rgba(255,255,255,0.35)" },
  link: { color: "#6366f1", textDecoration: "none", fontWeight: 600 },
};
