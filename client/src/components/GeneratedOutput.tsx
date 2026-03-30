import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  RefreshCw,
  ChevronDown,
  CheckCircle2,
  Tent,
  Heart,
  Briefcase,
  HelpCircle,
  Download,
  Sparkles,
  Crown,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GenerateOutput } from "@shared/schema";
import { downloadAsJson, downloadAsText, copyAsText, countWords } from "@/lib/export-utils";
import { cn } from "@/lib/utils";
import { SectionRegenerateDialog } from "./SectionRegenerateDialog";

interface GeneratedOutputProps {
  data: GenerateOutput;
  onRegenerate?: () => void;
  onRegenerateSection?: (section: string, feedback: string) => void;
  isRegenerating?: boolean;
}

function copyText(text: string) {
  navigator.clipboard.writeText(text).catch(() => { });
}

function sectionText(data: GenerateOutput, section: "hero" | "aboutUs" | "services" | "faq"): string {
  if (section === "hero" && data.hero) {
    const h = data.hero;
    return [h.headline, h.subheadline, h.cta_primary, h.cta_secondary, h.trust_signal].filter(Boolean).join("\n");
  }
  if (section === "aboutUs" && data.aboutUs) {
    const a = data.aboutUs;
    return [a.tagline, a.story, a.mission].filter(Boolean).join("\n");
  }
  if (section === "services" && data.services) {
    return data.services.map(s => `${s.title}: ${s.description}`).join("\n");
  }
  if (section === "faq" && data.faq) {
    return data.faq.map(f => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");
  }
  return "";
}

interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  onCopy: () => void;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
  defaultOpen?: boolean;
}

function SectionCard({ icon, title, children, onCopy, onRegenerate, isRegenerating, defaultOpen = true }: SectionCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-card">
      <div className="flex items-center justify-between px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          {icon}
          <span className="font-semibold text-sm text-foreground">{title}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2.5 text-xs font-mono gap-1 border-border dark:bg-transparent dark:hover:bg-muted"
            onClick={handleCopy}
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          {onRegenerate && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2.5 text-xs font-mono gap-1 border-border dark:bg-transparent dark:hover:bg-muted"
              onClick={onRegenerate}
              disabled={isRegenerating}
            >
              <RefreshCw className={cn("w-3.5 h-3.5", isRegenerating && "animate-spin")} />
              Regenerate
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setOpen(!open)}
          >
            <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform duration-200", open && "rotate-180")} />
          </Button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-5 py-4 space-y-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm text-foreground leading-relaxed">{value}</p>
    </div>
  );
}

export function GeneratedOutput({ data, onRegenerate, onRegenerateSection, isRegenerating }: GeneratedOutputProps) {
  const [copiedAll, setCopiedAll] = useState(false);
  const [regenerateDialogState, setRegenerateDialogState] = useState<{ open: boolean; section: string }>({ open: false, section: "" });
  const wordCount = countWords(data);

  const handleCopyAll = async () => {
    await copyAsText(data);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleSectionRegenerateClick = (sectionName: string) => {
    setRegenerateDialogState({ open: true, section: sectionName });
  };

  const handleConfirmSectionRegenerate = (feedback: string) => {
    if (onRegenerateSection) {
      onRegenerateSection(regenerateDialogState.section, feedback);
    }
    setRegenerateDialogState({ open: false, section: "" });
  };

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex-shrink-0 mb-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h2 className="text-xl font-bold text-foreground">Generated Content</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Build and launch AI-powered solutions without complex infrastructure.</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-mono font-semibold border border-border">
                {wordCount} Words
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-mono gap-1.5 dark:border-white/20 dark:bg-white/8 dark:hover:bg-white/12 dark:text-white"
              onClick={handleCopyAll}
            >
              {copiedAll ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedAll ? "Copied!" : "Copy All"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-mono gap-1.5 dark:border-white/20 dark:bg-white/8 dark:hover:bg-white/12 dark:text-white"
              onClick={() => downloadAsJson(data)}
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </Button>
            {onRegenerate && (
              <Button
                size="sm"
                className="h-8 text-xs font-bold gap-1.5 bg-gradient-to-r from-primary to-secondary text-white shadow-sm shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-px transition-all"
                onClick={onRegenerate}
                disabled={isRegenerating}
              >
                {isRegenerating ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                {isRegenerating ? "Regenerating..." : "Regenerate"}
              </Button>
            )}
          </div>
        </div>

        {/* Section Cards */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {data.hero && (
            <SectionCard
              icon={<Crown className="w-6 h-6 p-1 text-primary bg-accent/30 rounded-md" />}
              title="Hero Section"
              onCopy={() => copyText(sectionText(data, "hero"))}
              onRegenerate={onRegenerateSection ? () => handleSectionRegenerateClick("Hero Section") : undefined}
              isRegenerating={isRegenerating}
            >
              <Field label="Headline" value={data.hero.headline} />
              <Field label="Sub Headline" value={data.hero.subheadline} />
              <Field label="CTA Primary" value={data.hero.cta_primary} />
              {data.hero.cta_secondary && <Field label="CTA Secondary" value={data.hero.cta_secondary} />}
              {data.hero.trust_signal && <Field label="Trust Signal" value={data.hero.trust_signal} />}
            </SectionCard>
          )}

          {data.aboutUs && (
            <SectionCard
              icon={<Heart className="w-6 h-6 p-1 text-primary bg-accent/30 rounded-md" />}
              title="About Us"
              onCopy={() => copyText(sectionText(data, "aboutUs"))}
              onRegenerate={onRegenerateSection ? () => handleSectionRegenerateClick("About Us") : undefined}
              isRegenerating={isRegenerating}
            >
              <Field label="Tagline" value={data.aboutUs.tagline} />
              <Field label="Story" value={data.aboutUs.story} />
              <Field label="Mission" value={data.aboutUs.mission} />
            </SectionCard>
          )}

          {data.services && data.services.length > 0 && (
            <SectionCard
              icon={<ThumbsUp className="w-6 h-6 p-1 text-primary bg-accent/30 rounded-md" />}
              title="Services"
              onCopy={() => copyText(sectionText(data, "services"))}
              onRegenerate={onRegenerateSection ? () => handleSectionRegenerateClick("Services") : undefined}
              isRegenerating={isRegenerating}
            >
              <div className="space-y-4">
                {data.services.map((service, idx) => (
                  <div key={idx} className={cn(idx > 0 && "pt-4 border-t border-border/60")}>
                    <Field label={`Service ${idx + 1}`} value={service.title} />
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{service.description}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {data.faq && data.faq.length > 0 && (
            <SectionCard
              icon={<HelpCircle className="w-6 h-6 p-1 text-primary bg-accent/30 rounded-md" />}
              title="FAQ"
              onCopy={() => copyText(sectionText(data, "faq"))}
              onRegenerate={onRegenerateSection ? () => handleSectionRegenerateClick("FAQ") : undefined}
              isRegenerating={isRegenerating}
            >
              <div className="space-y-4">
                {data.faq.map((item, idx) => (
                  <div key={idx} className={cn(idx > 0 && "pt-4 border-t border-border/60")}>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Question {idx + 1}</p>
                    <p className="text-sm font-medium text-foreground mb-1">{item.question}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}
        </div>
      </div>

      <SectionRegenerateDialog
        open={regenerateDialogState.open}
        onOpenChange={(open) => setRegenerateDialogState(prev => ({ ...prev, open }))}
        sectionName={regenerateDialogState.section}
        onConfirm={handleConfirmSectionRegenerate}
        isRegenerating={!!isRegenerating}
      />
    </>
  );
}
