// ============================================================
// Nexora Extension — Shared Types
// ============================================================

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  skills: string[];
  education: Education[];
  experience: Experience[];
  preferredRoles: string[];
  experienceLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;
  gpa?: string;
}

export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export interface DetectedField {
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  label: string;
  type: FormFieldType;
  confidence: number; // 0–1
}

export type FormFieldType =
  | "name"
  | "first_name"
  | "last_name"
  | "email"
  | "phone"
  | "linkedin"
  | "github"
  | "portfolio"
  | "cover_letter"
  | "resume_upload"
  | "skills"
  | "graduation_year"
  | "gpa"
  | "university"
  | "degree"
  | "why_this_role"
  | "years_of_experience"
  | "salary_expectation"
  | "unknown";

export interface JobPageMetadata {
  title: string;
  company: string;
  location?: string;
  isRemote: boolean;
  requiredSkills: string[];
  description: string;
  applyUrl: string;
  platform: SupportedPlatform;
}

export type SupportedPlatform =
  | "linkedin"
  | "greenhouse"
  | "lever"
  | "workday"
  | "wellfound"
  | "internshala"
  | "ycombinator"
  | "generic";

export interface MatchAnalysis {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
}

export interface ExtensionMessage {
  type: ExtensionMessageType;
  payload?: any;
}

export type ExtensionMessageType =
  | "GET_PROFILE"
  | "PROFILE_DATA"
  | "TRIGGER_AUTOFILL"
  | "ANALYZE_JOB"
  | "ANALYSIS_RESULT"
  | "GENERATE_COVER_LETTER"
  | "COVER_LETTER_RESULT"
  | "SAVE_JOB"
  | "JOB_SAVED"
  | "SYNC_SESSION"
  | "AUTH_STATUS";
