"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  Loader2,
  Globe,
  Link as LinkIcon,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { OnboardingSchema, OnboardingInput } from "@/server/validators/onboarding.validator";
import posthog from "posthog-js";

const DOMAINS = [
  { label: "AI/ML", value: "ai_ml" },
  { label: "Web Development", value: "web_dev" },
  { label: "App Development", value: "app_dev" },
  { label: "Cybersecurity", value: "cybersecurity" },
  { label: "Blockchain", value: "blockchain" },
  { label: "Data Science", value: "data_science" },
  { label: "Cloud", value: "cloud" },
  { label: "UI/UX", value: "ui_ux" },
  { label: "DevOps", value: "devops" },
  { label: "Open Source", value: "open_source" },
];

const ROLES = [
  { label: "Frontend Developer", value: "frontend" },
  { label: "Backend Developer", value: "backend" },
  { label: "Full Stack Developer", value: "fullstack" },
  { label: "AI Engineer", value: "ai_engineer" },
  { label: "Data Analyst", value: "data_analyst" },
  { label: "Product Designer", value: "designer" },
  { label: "DevOps Engineer", value: "devops" },
  { label: "Mobile App Developer", value: "mobile" },
  { label: "Research Intern", value: "research" },
];

const SKILLS = [
  { label: "React", value: "react" },
  { label: "Next.js", value: "nextjs" },
  { label: "TypeScript", value: "typescript" },
  { label: "Python", value: "python" },
  { label: "PyTorch", value: "pytorch" },
  { label: "Tailwind CSS", value: "tailwindcss" },
  { label: "Node.js", value: "nodejs" },
  { label: "PostgreSQL", value: "postgresql" },
  { label: "Docker", value: "docker" },
  { label: "AWS", value: "aws" },
  { label: "Figma", value: "figma" },
];

const LOCATIONS = [
  { label: "Remote", value: "remote" },
  { label: "Bangalore", value: "bangalore" },
  { label: "Mumbai", value: "mumbai" },
  { label: "Delhi/NCR", value: "delhi" },
  { label: "Hyderabad", value: "hyderabad" },
  { label: "Pune", value: "pune" },
  { label: "Chennai", value: "chennai" },
  { label: "San Francisco", value: "sf" },
  { label: "New York", value: "ny" },
  { label: "London", value: "london" },
];

export default function OnboardingPage() {
  const [step, setStep] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();

  const form = useForm<OnboardingInput>({
    resolver: zodResolver(OnboardingSchema) as any,
    defaultValues: {
      fullName: "",
      college: "",
      graduationYear: 2026,
      skills: [],
      interests: [],
      preferredDomains: [],
      preferredRoles: [],
      preferredLocations: [],
      remotePreference: "Hybrid",
      experienceLevel: "Beginner",
      linkedinUrl: "",
      githubUrl: "",
      resumeUrl: "",
    },
  });

  const { errors } = form.formState;

  React.useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Onboarding Validation Errors:", errors);
    }
  }, [errors]);

  const nextStep = async () => {
    let fieldsToValidate: (keyof OnboardingInput)[] = [];
    if (step === 1) fieldsToValidate = ["fullName", "college", "graduationYear"];
    if (step === 2) fieldsToValidate = ["skills", "interests"];
    if (step === 3) fieldsToValidate = ["preferredDomains", "preferredRoles", "preferredLocations", "remotePreference", "experienceLevel"];

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      posthog.capture("onboarding_step_completed", { step, step_name: steps[step - 1]?.title });
      setStep((s) => s + 1);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setSelectedFile(file);
    setIsUploading(true);
    
    // Simulate upload
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Mock URL for now - in production, this would be the actual storage URL
      const mockUrl = `https://storage.nexora.com/resumes/${Math.random().toString(36).substring(7)}.pdf`;
      form.setValue("resumeUrl", mockUrl, { shouldValidate: true });
      toast.success("Resume uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload resume");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: OnboardingInput) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/v1/onboarding", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || "Failed to save profile");
      }

      const result = await response.json();

      posthog.capture("onboarding_completed", {
        experience_level: data.experienceLevel,
        skills_count: data.skills.length,
        preferred_domains: data.preferredDomains,
        preferred_roles: data.preferredRoles,
      });
      posthog.identify(posthog.get_distinct_id(), {
        name: data.fullName,
        college: data.college,
        graduation_year: data.graduationYear,
        experience_level: data.experienceLevel,
      });

      toast.success("Profile completed!");
      router.push("/dashboard");
    } catch (error) {
      posthog.captureException(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { title: "Basics", icon: User },
    { title: "Skills", icon: Sparkles },
    { title: "Goals", icon: Briefcase },
    { title: "Socials", icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Progress Header */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300",
                  step > i + 1 ? "bg-primary text-primary-foreground" : 
                  step === i + 1 ? "bg-primary/20 text-primary border border-primary/50" : 
                  "bg-muted text-muted-foreground"
                )}>
                  <s.icon className="h-5 w-5" />
                </div>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-wider",
                  step >= i + 1 ? "text-foreground" : "text-muted-foreground"
                )}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: "25%" }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            />
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="bg-card border border-border p-8 sm:p-12 rounded-3xl shadow-xl shadow-primary/5"
            >
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold font-outfit">Let's get started</h1>
                    <p className="text-muted-foreground mt-2">First, tell us a bit about your academic background.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input {...form.register("fullName")} placeholder="Alex Rivers" className="rounded-xl h-11" />
                      {form.formState.errors.fullName && <p className="text-xs text-destructive">{form.formState.errors.fullName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>College / University</Label>
                      <Input {...form.register("college")} placeholder="Stanford University" className="rounded-xl h-11" />
                      {form.formState.errors.college && <p className="text-xs text-destructive">{form.formState.errors.college.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Graduation Year</Label>
                      <Input type="number" {...form.register("graduationYear")} className="rounded-xl h-11" />
                      {form.formState.errors.graduationYear && <p className="text-xs text-destructive">{form.formState.errors.graduationYear.message}</p>}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold font-outfit">Your Skillset</h1>
                    <p className="text-muted-foreground mt-2">What are you good at? What do you want to learn?</p>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Core Skills</Label>
                      <MultiSelect 
                        options={SKILLS} 
                        selected={form.watch("skills")} 
                        onChange={(val) => form.setValue("skills", val)}
                        placeholder="Select your tech stack..."
                      />
                      {form.formState.errors.skills && <p className="text-xs text-destructive">{form.formState.errors.skills.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Interests / Topics</Label>
                      <MultiSelect 
                        options={DOMAINS} 
                        selected={form.watch("interests")} 
                        onChange={(val) => form.setValue("interests", val)}
                        placeholder="Search topics like Open Source, Web3..."
                      />
                      {form.formState.errors.interests && <p className="text-xs text-destructive">{form.formState.errors.interests.message}</p>}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold font-outfit">Career Goals</h1>
                    <p className="text-muted-foreground mt-2">Help us find the right opportunities for you.</p>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <Label>Preferred Domains</Label>
                          <MultiSelect options={DOMAINS} selected={form.watch("preferredDomains")} onChange={(v) => form.setValue("preferredDomains", v, { shouldValidate: true })} />
                          {form.formState.errors.preferredDomains && <p className="text-xs text-destructive">{form.formState.errors.preferredDomains.message}</p>}
                       </div>
                       <div className="space-y-2">
                          <Label>Preferred Roles</Label>
                          <MultiSelect options={ROLES} selected={form.watch("preferredRoles")} onChange={(v) => form.setValue("preferredRoles", v, { shouldValidate: true })} />
                          {form.formState.errors.preferredRoles && <p className="text-xs text-destructive">{form.formState.errors.preferredRoles.message}</p>}
                       </div>
                    </div>
                    <div className="space-y-2">
                       <Label>Preferred Locations</Label>
                       <MultiSelect options={LOCATIONS} selected={form.watch("preferredLocations")} onChange={(v) => form.setValue("preferredLocations", v, { shouldValidate: true })} placeholder="Select locations..." />
                       {form.formState.errors.preferredLocations && <p className="text-xs text-destructive">{form.formState.errors.preferredLocations.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Experience Level</Label>
                      <div className="grid grid-cols-3 gap-2">
                         {["Beginner", "Intermediate", "Advanced"].map((level) => (
                            <button
                               key={level}
                               type="button"
                               onClick={() => form.setValue("experienceLevel", level as any)}
                               className={cn(
                                  "py-2 rounded-xl border text-sm font-medium transition-all",
                                  form.watch("experienceLevel") === level ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 border-border hover:border-primary/50"
                               )}
                            >
                               {level}
                            </button>
                         ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold font-outfit">Final Touches</h1>
                    <p className="text-muted-foreground mt-2">Connect your socials and upload your resume.</p>
                  </div>
                  <div className="space-y-4">
                     <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-muted/30">
                          <div className="h-10 w-10 rounded-xl bg-background border flex items-center justify-center">
                            <LinkIcon className="h-5 w-5 text-[#0077B5]" />
                          </div>
                          <Input {...form.register("linkedinUrl")} placeholder="https://linkedin.com/in/alex" className="flex-1 bg-transparent border-none focus-visible:ring-0" />
                      </div>
                      {errors.linkedinUrl && <p className="text-xs text-destructive px-4">{errors.linkedinUrl.message}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-muted/30">
                         <div className="h-10 w-10 rounded-xl bg-background border flex items-center justify-center">
                            <Globe className="h-5 w-5" />
                         </div>
                         <Input {...form.register("githubUrl")} placeholder="https://github.com/alex" className="flex-1 bg-transparent border-none focus-visible:ring-0" />
                      </div>
                      {errors.githubUrl && <p className="text-xs text-destructive px-4">{errors.githubUrl.message}</p>}
                    </div>
                    <div className="mt-6">
                        <Label className="mb-2 block">Resume (PDF)</Label>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleFileChange} 
                          accept=".pdf" 
                          className="hidden" 
                        />
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const file = e.dataTransfer.files?.[0];
                            if (file) processFile(file);
                          }}
                          className={cn(
                            "border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer group relative overflow-hidden",
                            isUploading && "pointer-events-none opacity-70",
                            selectedFile && "border-primary/50 bg-primary/5"
                          )}
                        >
                          {isUploading ? (
                            <div className="space-y-3">
                              <Loader2 className="h-8 w-8 text-primary mx-auto animate-spin" />
                              <p className="text-sm font-medium">Uploading your resume...</p>
                            </div>
                          ) : selectedFile ? (
                            <div className="space-y-2">
                              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                                <FileText className="h-6 w-6 text-primary" />
                              </div>
                              <p className="text-sm font-bold truncate max-w-[200px] mx-auto">{selectedFile.name}</p>
                              <p className="text-xs text-muted-foreground">Click to change file</p>
                            </div>
                          ) : (
                            <>
                              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2 group-hover:text-primary transition-colors" />
                              <p className="text-sm font-medium">Click to upload or drag and drop</p>
                              <p className="text-xs text-muted-foreground mt-1">Maximum file size 5MB</p>
                            </>
                          )}
                        </div>
                        {form.formState.errors.resumeUrl && (
                          <p className="text-xs text-destructive mt-2">{form.formState.errors.resumeUrl.message}</p>
                        )}
                     </div>
                  </div>
                </div>
              )}

              <div className="mt-12 flex justify-between items-center">
                <Button 
                  type="button"
                  variant="ghost" 
                  onClick={() => setStep((s) => s - 1)}
                  className={cn("rounded-xl", step === 1 && "invisible")}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                
                {step < 4 ? (
                  <Button type="button" onClick={nextStep} className="rounded-xl px-8 h-11 bg-primary hover:bg-primary/90">
                    Continue
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={isLoading} 
                    className="rounded-xl px-10 h-11 shadow-lg shadow-primary/20"
                  >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Complete Profile"}
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
