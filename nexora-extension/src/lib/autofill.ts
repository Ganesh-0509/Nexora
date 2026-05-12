import { DetectedField, FormFieldType, UserProfile } from "./types";

/**
 * Normalizes a label string for matching.
 */
function normalizeLabel(label: string): string {
  return label.toLowerCase().trim().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ");
}

/**
 * Infers the FormFieldType from an element's label, name, id, placeholder and aria attributes.
 */
export function inferFieldType(el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): {
  type: FormFieldType;
  confidence: number;
} {
  const attributes = [
    el.getAttribute("name") || "",
    el.getAttribute("id") || "",
    el.getAttribute("placeholder") || "",
    el.getAttribute("aria-label") || "",
    el.getAttribute("autocomplete") || "",
  ].map(normalizeLabel);

  // Check for adjacent label element
  const labelEl = document.querySelector(`label[for="${el.id}"]`);
  if (labelEl) attributes.push(normalizeLabel(labelEl.textContent || ""));

  const combined = attributes.join(" ");

  const rules: { patterns: RegExp[]; type: FormFieldType; confidence: number }[] = [
    { patterns: [/\bemail\b/], type: "email", confidence: 0.98 },
    { patterns: [/\bphone\b/, /\bmobile\b/, /\btel\b/], type: "phone", confidence: 0.95 },
    { patterns: [/\blinkedin\b/], type: "linkedin", confidence: 0.97 },
    { patterns: [/\bgithub\b/], type: "github", confidence: 0.97 },
    { patterns: [/\bportfolio\b/, /\bwebsite\b/, /\bpersonal.?url\b/], type: "portfolio", confidence: 0.9 },
    { patterns: [/\bfirst.?name\b/, /\bgiven.?name\b/], type: "first_name", confidence: 0.95 },
    { patterns: [/\blast.?name\b/, /\bsurname\b/, /\bfamily.?name\b/], type: "last_name", confidence: 0.95 },
    { patterns: [/\bfull.?name\b/, /\byour.?name\b/], type: "name", confidence: 0.92 },
    { patterns: [/\bcover.?letter\b/], type: "cover_letter", confidence: 0.99 },
    { patterns: [/\bwhy.*(this|our|the).*(role|job|company|position)/], type: "why_this_role", confidence: 0.93 },
    { patterns: [/\bgraduate\b/, /\bgraduation.?year\b/, /\bexpected.?grad\b/], type: "graduation_year", confidence: 0.9 },
    { patterns: [/\bgpa\b/, /\bgrade.?point/], type: "gpa", confidence: 0.95 },
    { patterns: [/\buniversity\b/, /\bcollege\b/, /\binstitution\b/, /\bschool\b/], type: "university", confidence: 0.9 },
    { patterns: [/\bskill\b/], type: "skills", confidence: 0.8 },
    { patterns: [/\byears.of.exp\b/, /\bexperience.years\b/], type: "years_of_experience", confidence: 0.88 },
    { patterns: [/\bsalary\b/, /\bcompensation\b/, /\bstipend\b/], type: "salary_expectation", confidence: 0.85 },
    { patterns: [/\bfile\b/, /\bresume\b/, /\bcv\b/], type: "resume_upload", confidence: 0.9 },
  ];

  for (const rule of rules) {
    if (rule.patterns.some(pattern => pattern.test(combined))) {
      return { type: rule.type, confidence: rule.confidence };
    }
  }

  return { type: "unknown", confidence: 0 };
}

/**
 * Scans the DOM for all eligible form fields and infers their types.
 */
export function detectFormFields(): DetectedField[] {
  const selectors = "input:not([type=hidden]):not([type=submit]):not([type=button]), textarea, select";
  const elements = Array.from(document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(selectors));
  
  return elements
    .map(el => {
      const { type, confidence } = inferFieldType(el);
      const labelEl = el.id ? document.querySelector(`label[for="${el.id}"]`) : null;
      return {
        element: el,
        label: labelEl?.textContent?.trim() || el.getAttribute("placeholder") || el.getAttribute("name") || "",
        type,
        confidence,
      };
    })
    .filter(f => f.confidence > 0.3);
}

/**
 * Fills a single form field with the given value.
 * Dispatches native events to ensure React/Vue/Angular controlled inputs update correctly.
 */
export function fillField(el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, value: string): void {
  el.focus();
  
  const nativeInputSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
  const nativeTextareaSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
  
  if (el instanceof HTMLInputElement && nativeInputSetter) {
    nativeInputSetter.call(el, value);
  } else if (el instanceof HTMLTextAreaElement && nativeTextareaSetter) {
    nativeTextareaSetter.call(el, value);
  } else {
    el.value = value;
  }

  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
  el.blur();
}

/**
 * Runs autofill for a list of detected fields against the user's profile.
 */
export function autofillFields(fields: DetectedField[], profile: UserProfile): number {
  let filled = 0;

  const valueMap: Partial<Record<FormFieldType, string>> = {
    name: profile.fullName,
    first_name: profile.fullName.split(" ")[0] || "",
    last_name: profile.fullName.split(" ").slice(1).join(" ") || "",
    email: profile.email,
    phone: profile.phone || "",
    linkedin: profile.linkedinUrl || "",
    github: profile.githubUrl || "",
    portfolio: profile.portfolioUrl || "",
    university: profile.education[0]?.institution || "",
    graduation_year: profile.education[0]?.endYear?.toString() || "",
    gpa: profile.education[0]?.gpa || "",
    skills: profile.skills.join(", "),
  };

  for (const field of fields) {
    const value = valueMap[field.type];
    if (value && field.type !== "resume_upload" && field.type !== "cover_letter") {
      fillField(field.element, value);
      filled++;
    }
  }

  return filled;
}
