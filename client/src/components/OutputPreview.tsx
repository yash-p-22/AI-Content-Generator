import { useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  FileJson,
  FileText,
  CheckCircle2,
  Sparkles,
  icons,
  Copy,
} from "lucide-react";
import type { GenerateOutput } from "@shared/schema";
import { downloadAsJson, downloadAsText, copyAsText } from "@/lib/export-utils";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

interface OutputPreviewProps {
  data: GenerateOutput;
  title?: string;
}

export function OutputPreview({
  data,
  title = "Generated Content",
}: OutputPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyAsText(data);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white dark:bg-card rounded-2xl rounded-t-none border border-gray-100 dark:border-border shadow-xl shadow-gray-200/40 dark:shadow-black/20 overflow-hidden flex flex-col h-full">
      {/* Header Toolbar */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-[#1e2744] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400" />
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-8 hover-elevate active-elevate-2 font-mono dark:border-white/25 dark:bg-white/8 dark:hover:bg-white/15 dark:text-white"
            onClick={() => downloadAsJson(data)}
          >
            <FileJson className="w-3.5 h-3.5 mr-2 text-primary dark:text-indigo-300" />
            .JSON
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-8 hover-elevate active-elevate-2 font-mono dark:border-white/25 dark:bg-white/8 dark:hover:bg-white/15 dark:text-white"
            onClick={() => downloadAsText(data)}
          >
            <FileText className="w-3.5 h-3.5 mr-2 text-secondary dark:text-violet-300" />
            .TXT
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-8 hover-elevate active-elevate-2 font-mono dark:border-white/25 dark:bg-white/8 dark:hover:bg-white/15 dark:text-white"
            onClick={handleCopy}
          >
            {copied ? (
              <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-green-500 dark:text-green-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 mr-2 text-secondary dark:text-violet-300" />
            )}
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 overflow-y-auto space-y-8 bg-gray-50/30 dark:bg-background/30">
        {data.hero && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-gradient-to-br from-indigo-50/60 to-violet-50/60 dark:from-indigo-500/8 dark:to-violet-500/8 border border-indigo-100 dark:border-indigo-500/20"
          >
            <div className="inline-block px-2 py-1 bg-indigo-100 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 rounded text-xs font-mono font-medium mb-4">
              Hero Section
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-50 leading-tight mb-4">
              {data.hero.headline}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-2xl leading-relaxed">
              {data.hero.subheadline}
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="px-5 py-2.5 bg-gray-900 dark:bg-primary/80 text-white font-medium rounded-lg shadow-md text-sm cursor-default">
                {data.hero.cta_primary}
              </div>
              {data.hero.cta_secondary && (
                <div className="px-5 py-2.5 bg-white dark:bg-muted text-gray-700 dark:text-gray-200 font-medium rounded-lg border border-gray-200 dark:border-border shadow-sm text-sm cursor-default">
                  {data.hero.cta_secondary}
                </div>
              )}
            </div>
          </motion.section>
        )}

        {data.services && data.services.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="inline-block px-2 py-1 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 rounded text-xs font-mono font-medium mb-4 border border-cyan-100 dark:border-cyan-500/20">
              Value Pillars / Services
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.services.map((service, idx) => {
                const IconComponent = (icons as any)[service?.icon] || Sparkles;

                return (
                  <div
                    key={idx}
                    className="p-5 bg-white dark:bg-card border border-gray-100 dark:border-border rounded-xl shadow-sm hover:shadow-md dark:hover:shadow-black/20 transition-shadow"
                  >
                    <div className="w-10 h-10 rounded-lg bg-indigo-50/50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center mb-3">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {service.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.section>
        )}

        {data.faq && data.faq.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-block px-2 py-1 bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 rounded text-xs font-mono font-medium mb-4 border border-purple-100 dark:border-purple-500/20">
              Frequently Asked Questions
            </div>
            <div className="bg-white dark:bg-card rounded-xl border border-gray-100 dark:border-border overflow-hidden shadow-sm">
              <Accordion type="single" collapsible className="w-full">
                {data.faq.map((faq, idx) => (
                  <AccordionItem
                    key={idx}
                    value={`item-${idx}`}
                    className="border-gray-100 dark:border-border px-4"
                  >
                    <AccordionTrigger className="text-sm font-semibold hover:no-underline hover:text-primary transition-colors text-left text-gray-900 dark:text-gray-100">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-500 dark:text-muted-foreground text-sm leading-relaxed pb-4 pr-6">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </motion.section>
        )}

        <div className="flex items-center justify-center px-12">
          <Separator className="bg-gray-200 dark:bg-border w-full rounded-full h-px" />
        </div>

        <div className="flex items-center gap-2 px-12 pb-6">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Actions:
          </p>
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-8 hover-elevate active-elevate-2 font-mono dark:border-white/25 dark:bg-white/8 dark:hover:bg-white/15 dark:text-white"
            onClick={() => downloadAsJson(data)}
          >
            <FileJson className="w-3.5 h-3.5 mr-2 text-primary dark:text-indigo-300" />
            .JSON
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-8 hover-elevate active-elevate-2 font-mono dark:border-white/25 dark:bg-white/8 dark:hover:bg-white/15 dark:text-white"
            onClick={() => downloadAsText(data)}
          >
            <FileText className="w-3.5 h-3.5 mr-2 text-secondary dark:text-violet-300" />
            .TXT
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-8 hover-elevate active-elevate-2 font-mono dark:border-white/25 dark:bg-white/8 dark:hover:bg-white/15 dark:text-white"
            onClick={handleCopy}
          >
            {copied ? (
              <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-green-500 dark:text-green-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 mr-2 text-secondary dark:text-violet-300" />
            )}
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>
    </div>
  );
}
