import { z } from "zod";

export const OnboardingSchema = z.object({
  // Step 1: Basic Info
  fullName: z.string().min(2, "Full name is required"),
  college: z.string().min(2, "College name is required"),
  graduationYear: z.coerce.number().min(2000).max(2035),
  
  // Step 2: Skills & Interests
  skills: z.array(z.string()).min(1, "Select at least one skill"),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  
  // Step 3: Career Preferences
  preferredDomains: z.array(z.string()).min(1, "Select at least one domain"),
  preferredRoles: z.array(z.string()).min(1, "Select at least one role"),
  preferredLocations: z.array(z.string()).min(1, "Select at least one location"),
  remotePreference: z.enum(["Remote", "On-site", "Hybrid"]),
  experienceLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
  
  // Step 4: Socials & Resume
  linkedinUrl: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
  resumeUrl: z.string().url("Invalid Resume URL").optional().or(z.literal("")),
});

export type OnboardingInput = z.infer<typeof OnboardingSchema>;
