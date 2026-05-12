import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { UserProfile, JobPageMetadata } from "@/lib/types";
import { Dashboard } from "./components/Dashboard";
import { LoginPrompt } from "./components/LoginPrompt";

function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentJob, setCurrentJob] = useState<JobPageMetadata | null>(null);

  useEffect(() => {
    // Request profile from background
    chrome.runtime.sendMessage({ type: "GET_PROFILE" }, (response) => {
      setProfile(response?.payload ?? null);
      setIsLoading(false);
    });

    // Request current job metadata from content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "ANALYZE_JOB" }, (response) => {
          if (response?.payload) setCurrentJob(response.payload);
        });
      }
    });
  }, []);

  if (isLoading) {
    return (
      <div style={styles.center}>
        <div style={styles.spinner} />
      </div>
    );
  }

  if (!profile) {
    return <LoginPrompt />;
  }

  return <Dashboard profile={profile} currentJob={currentJob} />;
}

const styles: Record<string, React.CSSProperties> = {
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "480px",
    background: "#0a0a0f",
  },
  spinner: {
    width: 28,
    height: 28,
    border: "3px solid rgba(255,255,255,0.1)",
    borderTop: "3px solid #6366f1",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
