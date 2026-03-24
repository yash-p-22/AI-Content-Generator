import { useState, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Wand2,
  Building2,
  Users,
  Smile,
  LayoutList,
  ShieldCheck,
  Crown,
  Minimize2,
  AlertCircle,
  BadgeCheck,
  TrendingUp,
  AlignJustify,
} from "lucide-react";
import { generateInputSchema, type GenerateInput } from "@shared/schema";
import { useGenerateContent } from "@/hooks/use-generate";
import { countWords } from "@/lib/export-utils";
import { Sidebar } from "@/components/layout/Sidebar";
import { GeneratedOutput } from "@/components/GeneratedOutput";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const INDUSTRIES = [
  "SaaS / Tech",
  "E-commerce",
  "Healthcare",
  "Finance",
  "Education",
  "Real Estate",
  "Marketing / Agency",
  "Manufacturing",
  "Consulting",
  "Other",
];

const PAGE_SECTIONS = ["Hero Section", "About Us", "Services", "FAQ"];

const BRAND_VOICES = [
  { id: "Professional" as const, icon: ShieldCheck, label: "Professional" },
  { id: "Luxury" as const, icon: Crown, label: "Luxury" },
  { id: "Minimal" as const, icon: Minimize2, label: "Minimal" },
];

const STEPS = ["Business", "Audience", "Tone", "Section"];

function SectionHeading({ icon: Icon, label, className }: { icon: React.ElementType; label: string, className?: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon className={cn("w-4 h-4 text-primary", className)} />
      <h3 className="text-sm font-bold text-foreground">{label}</h3>
    </div>
  );
}

export default function Generator() {
  const {
    mutate: generate,
    mutateAsync: generateAsync,
    isPending,
    data: output,
    error,
    reset,
  } = useGenerateContent();

  const form = useForm<GenerateInput>({
    resolver: zodResolver(generateInputSchema),
    defaultValues: {
      businessDescription: "",
      industry: "SaaS / Tech",
      targetAudience: "",
      brandVoice: "Professional",
      pageSections: ["Hero Section", "About Us", "Services"],
    },
  });

  const businessDescription = useWatch({ control: form.control, name: "businessDescription" });
  const targetAudience = useWatch({ control: form.control, name: "targetAudience" });
  const brandVoice = useWatch({ control: form.control, name: "brandVoice" });
  const pageSections = useWatch({ control: form.control, name: "pageSections" });

  const stepsComplete = useMemo(() => [
    (businessDescription?.length >= 10) && !!form.getValues("industry"),
    targetAudience?.length > 0,
    true,
    (pageSections?.length ?? 0) > 0,
  ], [businessDescription, targetAudience, pageSections, form]);

  const completedCount = stepsComplete.filter(Boolean).length;
  const progress = Math.round((completedCount / 4) * 100);

  const toggleSection = (section: string) => {
    const current = pageSections || [];
    const next = current.includes(section)
      ? current.filter((s) => s !== section)
      : [...current, section];
    form.setValue("pageSections", next, { shouldValidate: true });
  };

  const handleClear = () => {
    form.reset();
    reset();
  };

  const onSubmit = (data: GenerateInput) => {
    generate(data);
  };

  const handleRegenerate = () => {
    const values = form.getValues();
    generate(values);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">
        {/* Page header */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-border bg-background/80 backdrop-blur-sm">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Generate</h1>
          {output && (
            <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-mono font-semibold border border-border">
              {countWords(output)} Words
            </span>
          )}
        </div>

        {/* Main layout: Stacked on mobile, side-by-side on desktop */}
        <div className="flex-1 overflow-y-auto md:overflow-hidden flex flex-col md:flex-row gap-0">
          {/* ─── LEFT: Form Panel ─────────────────────────────── */}
          <div className="w-full md:w-[350px] lg:w-[390px] flex-shrink-0 flex flex-col border-b md:border-b-0 md:border-r border-border bg-background">
            <div className="flex-1 overflow-y-auto">
              <div className="p-5">
                {/* Step tabs */}
                <div className="grid grid-cols-4 gap-1.5 mb-4">
                  {STEPS.map((step, i) => (
                    <div
                      key={step}
                      className={cn(
                        "flex flex-col items-center py-2.5 px-1 border rounded-xl text-center transition-colors",
                        stepsComplete[i]
                          ? "border-primary/40 bg-primary/5 dark:bg-primary/10"
                          : "border-border bg-card"
                      )}
                    >
                      <span
                        className={cn(
                          "text-[10px] font-mono font-bold leading-none mb-1",
                          stepsComplete[i] ? "text-primary" : "text-muted-foreground"
                        )}
                      >
                        {i + 1}
                      </span>
                      <span
                        className={cn(
                          "text-[11px] font-semibold leading-none",
                          stepsComplete[i] ? "text-primary" : "text-muted-foreground"
                        )}
                      >
                        {step}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="relative mb-8">
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                  <motion.div
                    className="absolute -bottom-6 transform -translate-x-1/2 px-2 py-0.5 bg-primary rounded-full text-white text-[10px] font-mono font-bold whitespace-nowrap"
                    animate={{ left: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    {progress}%
                  </motion.div>
                </div>

                {/* Error */}
                {error && (
                  <Alert variant="destructive" className="mb-4 py-2">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <AlertDescription className="text-xs">{error.message}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* ── Business ── */}
                  <section>
                    <SectionHeading icon={TrendingUp} className="border border-primary w-5 h-5 rounded-md px-2 p-1 " label="Business" />
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1.5 block">
                          Business
                        </Label>
                        <Textarea
                          placeholder="We are a digital services company specialising in AI-driven solutions and custom software development for business."
                          rows={4}
                          {...form.register("businessDescription")}
                          className={cn(
                            "resize-none text-sm bg-muted/30 dark:bg-muted/20 border-border focus:bg-background transition-colors",
                            form.formState.errors.businessDescription && "border-destructive"
                          )}
                        />
                        {form.formState.errors.businessDescription && (
                          <p className="text-xs text-destructive mt-1">
                            {form.formState.errors.businessDescription.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label className="text-xs text-muted-foreground mb-1.5 block">
                          Industry
                        </Label>
                        <Select
                          defaultValue="SaaS / Tech"
                          onValueChange={(v) => form.setValue("industry", v, { shouldValidate: true })}
                        >
                          <SelectTrigger className="text-sm bg-muted/30 dark:bg-muted/20 border-border h-9">
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {INDUSTRIES.map((ind) => (
                              <SelectItem key={ind} value={ind} className="text-sm">
                                {ind}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </section>

                  {/* ── Audience ── */}
                  <section>
                    <SectionHeading icon={Users} label="Audience" />
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">
                        Type your Target Audience
                      </Label>
                      <Textarea
                        placeholder="Students..."
                        rows={3}
                        {...form.register("targetAudience")}
                        className={cn(
                          "resize-none text-sm bg-muted/30 dark:bg-muted/20 border-border focus:bg-background transition-colors",
                          form.formState.errors.targetAudience && "border-destructive"
                        )}
                      />
                      {form.formState.errors.targetAudience && (
                        <p className="text-xs text-destructive mt-1">
                          {form.formState.errors.targetAudience.message}
                        </p>
                      )}
                    </div>
                  </section>

                  {/* ── Brand Voice ── */}
                  <section>
                    <SectionHeading icon={BadgeCheck} label="Brand Voice" />
                    <div className="grid grid-cols-3 gap-2.5">
                      {BRAND_VOICES.map(({ id, icon: Icon, label }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => form.setValue("brandVoice", id, { shouldValidate: true })}
                          className={cn(
                            "flex flex-col items-center gap-2 py-3.5 px-2 border-2 rounded-xl transition-all duration-200 cursor-pointer",
                            brandVoice === id
                              ? "border-primary bg-primary/10 dark:bg-primary/15 shadow-sm shadow-primary/20"
                              : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                          )}
                        >
                          <Icon className={cn("w-5 h-5", brandVoice === id ? "text-primary" : "text-muted-foreground")} />
                          <span className="text-[11px] font-semibold">{label}</span>
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* ── Page Sections ── */}
                  <section>
                    <SectionHeading icon={AlignJustify} className="border border-primary w-5 h-5 rounded-md px-2 p-1 " label="Page Section" />
                    <div className="flex flex-wrap gap-2">
                      {PAGE_SECTIONS.map((section) => {
                        const selected = (pageSections || []).includes(section);
                        return (
                          <button
                            key={section}
                            type="button"
                            onClick={() => toggleSection(section)}
                            className={cn(
                              "px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-200 cursor-pointer",
                              selected
                                ? "border-primary bg-primary/10 shadow-sm shadow-primary/25"
                                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                            )}
                          >
                            {section}
                          </button>
                        );
                      })}
                    </div>
                    {form.formState.errors.pageSections && (
                      <p className="text-xs text-destructive mt-2">
                        {form.formState.errors.pageSections.message}
                      </p>
                    )}
                  </section>
                </form>
              </div>
            </div>

            {/* Sticky Generate/Clear buttons */}
            <div className="flex-shrink-0 p-4 border-t border-border bg-background gap-2 flex">
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 h-11 font-bold bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35 hover:-translate-y-px transition-all duration-200"
                onClick={form.handleSubmit(onSubmit)}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate Content
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="px-5 h-11 font-semibold border-border dark:bg-transparent dark:hover:bg-muted"
                onClick={handleClear}
              >
                Clear
              </Button>
            </div>
          </div>

          {/* ─── RIGHT: Output Panel ──────────────────────────── */}
          <div className="flex-1 flex flex-col min-h-[400px] md:min-h-0 bg-muted/5">
            <AnimatePresence mode="wait">
              {output ? (
                <motion.div
                  key="output"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex-1 md:overflow-hidden p-4 md:p-6"
                >
                  <GeneratedOutput
                    data={output}
                    onRegenerate={handleRegenerate}
                    isRegenerating={isPending}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex items-center justify-center p-8"
                >
                  <div className="text-center max-w-xs">
                    <div className="w-16 h-16 rounded-2xl bg-muted mx-auto flex items-center justify-center mb-4">
                      <Wand2 className="w-7 h-7 text-muted-foreground" />
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-1.5">
                      Awaiting Instructions
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Fill in your business details on the left and click
                      "Generate Content" to craft your website copy.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
