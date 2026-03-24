import type { GenerateOutput } from "@shared/schema";

export function countWords(output: GenerateOutput): number {
  const texts: string[] = [];
  if (output.hero) {
    texts.push(output.hero.headline, output.hero.subheadline, output.hero.cta_primary);
    if (output.hero.cta_secondary) texts.push(output.hero.cta_secondary);
    if (output.hero.trust_signal) texts.push(output.hero.trust_signal);
  }
  if (output.aboutUs) {
    texts.push(output.aboutUs.tagline, output.aboutUs.story, output.aboutUs.mission);
  }
  if (output.services) {
    output.services.forEach(s => texts.push(s.title, s.description));
  }
  if (output.faq) {
    output.faq.forEach(f => texts.push(f.question, f.answer));
  }
  return texts.join(" ").split(/\s+/).filter(w => w.length > 0).length;
}

export function formatAsText(data: GenerateOutput): string {
  let text = "";

  if (data.hero) {
    text += `=== HERO SECTION ===\n`;
    text += `Headline: ${data.hero.headline}\n`;
    text += `Sub Headline: ${data.hero.subheadline}\n`;
    text += `CTA Primary: ${data.hero.cta_primary}\n`;
    if (data.hero.cta_secondary) text += `CTA Secondary: ${data.hero.cta_secondary}\n`;
    if (data.hero.trust_signal) text += `Trust Signal: ${data.hero.trust_signal}\n`;
    text += `\n`;
  }

  if (data.aboutUs) {
    text += `=== ABOUT US ===\n`;
    text += `Tagline: ${data.aboutUs.tagline}\n`;
    text += `Story: ${data.aboutUs.story}\n`;
    text += `Mission: ${data.aboutUs.mission}\n`;
    text += `\n`;
  }

  if (data.services && data.services.length > 0) {
    text += `=== SERVICES ===\n`;
    data.services.forEach((s, i) => {
      text += `${i + 1}. ${s.title}\n   ${s.description}\n`;
    });
    text += `\n`;
  }

  if (data.faq && data.faq.length > 0) {
    text += `=== FAQ ===\n`;
    data.faq.forEach(f => {
      text += `Q: ${f.question}\nA: ${f.answer}\n\n`;
    });
  }

  return text.trim();
}

export function downloadAsJson(data: GenerateOutput, filename = "ai-content.json") {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  triggerDownload(blob, filename);
}

export function downloadAsText(data: GenerateOutput, filename = "ai-content.txt") {
  const blob = new Blob([formatAsText(data)], { type: "text/plain" });
  triggerDownload(blob, filename);
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function copyAsText(data: GenerateOutput): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(formatAsText(data));
    return true;
  } catch {
    return false;
  }
}
