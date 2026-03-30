import { z } from "zod";

// ─── Input Schema ────────────────────────────────────────────────────────────

export const generateInputSchema = z.object({
  businessDescription: z.string().min(10, "Please describe your business (min 10 characters)"),
  industry: z.string().min(1, "Industry is required"),
  targetAudience: z.string().min(1, "Target audience is required"),
  brandVoice: z.enum(["Professional", "Luxury", "Minimal"]),
  pageSections: z.array(z.string()).min(1, "Select at least one section"),
  regeneratingSection: z.string().optional(),
  regenerationFeedback: z.string().optional(),
  previousContent: z.any().optional(),
});

// ─── Output Schemas ──────────────────────────────────────────────────────────

export const heroOutputSchema = z.object({
  headline: z.string(),
  subheadline: z.string(),
  cta_primary: z.string(),
  cta_secondary: z.string().optional(),
  trust_signal: z.string().optional(),
});

export const aboutUsOutputSchema = z.object({
  tagline: z.string(),
  story: z.string(),
  mission: z.string(),
});

export const serviceItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
});

export const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const generateOutputSchema = z.object({
  hero: heroOutputSchema.optional(),
  aboutUs: aboutUsOutputSchema.optional(),
  services: z.array(serviceItemSchema).optional(),
  faq: z.array(faqItemSchema).optional(),
});

// ─── Types ───────────────────────────────────────────────────────────────────

export type GenerateInput = z.infer<typeof generateInputSchema>;
export type GenerateOutput = z.infer<typeof generateOutputSchema>;

export interface GenerationRecord {
  id?: number;
  timestamp: number;
  inputData: GenerateInput;
  outputData: GenerateOutput;
}
