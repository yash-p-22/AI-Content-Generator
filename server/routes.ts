import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

function buildSectionSchema(sections: string[]): string {
  const parts: string[] = [];

  if (sections.includes("Hero Section")) {
    parts.push(`"hero": {
    "headline": "...",
    "subheadline": "...",
    "cta_primary": "...",
    "cta_secondary": "...",
    "trust_signal": "..."
  }`);
  }
  if (sections.includes("About Us")) {
    parts.push(`"aboutUs": {
    "tagline": "...",
    "story": "...",
    "mission": "..."
  }`);
  }
  if (sections.includes("Services")) {
    parts.push(`"services": [
    { "title": "...", "description": "..." }
  ]`);
  }
  if (sections.includes("FAQ")) {
    parts.push(`"faq": [
    { "question": "...", "answer": "..." }
  ]`);
  }

  return `{\n  ${parts.join(",\n  ")}\n}`;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  app.post(api.content.generate.path, async (req, res) => {
    try {
      const input = api.content.generate.input.parse(req.body);
      const sections = input.pageSections;

      let systemPrompt = `You are an expert website copywriter specialising in ${input.brandVoice.toLowerCase()} brand voice.
Generate structured website content based on the business details provided.
Return ONLY valid JSON following this exact schema:
${buildSectionSchema(sections)}

Requirements per section:
${
  sections.includes("Hero Section")
    ? `Hero Section:
- A powerful, compelling marketing headline (10-12 words)
- Clear value-focused subheadline (25-35 words)
- Two distinct CTAs (primary and secondary)
- A trust signal (e.g. "Trusted by 500+ companies worldwide")`
    : ""
}
${
  sections.includes("About Us")
    ? `About Us:
- Tagline: short, memorable brand positioning statement (5-8 words)
- Story: engaging brand narrative paragraph (3-5 sentences)
- Mission: clear mission statement (2-3 sentences)`
    : ""
}
${
  sections.includes("Services")
    ? `Services:
- 3 to 5 services with title and description (1-2 sentences each)`
    : ""
}
${
  sections.includes("FAQ")
    ? `FAQ:
- 5 frequently asked questions with concise answers`
    : ""
}

Tone: ${input.brandVoice} — ${
        input.brandVoice === "Professional"
          ? "authoritative, trustworthy, clear"
          : input.brandVoice === "Luxury"
            ? "exclusive, sophisticated, aspirational"
            : "clean, direct, minimal"
      }`;

      let userPrompt = `Generate website content for:
Business: ${input.businessDescription}
Industry: ${input.industry}
Target Audience: ${input.targetAudience}
Brand Voice: ${input.brandVoice}
Sections to generate: ${sections.join(", ")}`;

      if (input.regeneratingSection && input.regenerationFeedback) {
        systemPrompt = `You are an expert website copywriter specialising in ${input.brandVoice.toLowerCase()} brand voice.
CRITICAL INSTRUCTION: You are REVISING an existing section based on user feedback. You MUST prioritize the user's feedback above all else.
Return ONLY valid JSON following this exact schema:
${buildSectionSchema(sections)}

Tone: ${input.brandVoice}`;

        userPrompt = `Business Context:
Business: ${input.businessDescription}
Industry: ${input.industry}
Target Audience: ${input.targetAudience}

--- REGENERATION TASK ---
We are regenerating ONLY the "${input.regeneratingSection}" section.

Here is the PREVIOUS generated content for this section:
${JSON.stringify(input.previousContent || {}, null, 2)}

Here is the USER'S FEEDBACK requesting specific changes:
"${input.regenerationFeedback}"

INSTRUCTIONS:
1. Analyze the USER'S FEEDBACK carefully.
2. Rewrite the previous content to explicitly incorporate the requested changes, tone, or specific additions.
3. If the user asks to add something, ADD IT. If they ask to change the tone, CHANGE IT.
4. Output ONLY the updated section in valid JSON format according to the schema.`;
      }

      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
        },
      });

      const content = result.response.text();
      if (!content) {
        throw new Error("Failed to generate content from AI");
      }

      const parsedContent = JSON.parse(content);
      const validOutput =
        api.content.generate.responses[200].parse(parsedContent);

      res.status(200).json(validOutput);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      console.error("Generate error:", err);
      res.status(500).json({ message: "An error occurred during generation" });
    }
  });

  return httpServer;
}
