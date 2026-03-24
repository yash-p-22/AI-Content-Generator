import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { motion } from "framer-motion";
import { db } from "@/lib/db";
import { Sidebar } from "@/components/layout/Sidebar";
import { GeneratedOutput } from "@/components/GeneratedOutput";
import { useGenerateContent } from "@/hooks/use-generate";
import type { GenerateInput } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { Database, Clock, RefreshCw, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export default function History() {
  const [regeneratingId, setRegeneratingId] = useState<number | null>(null);
  const { mutateAsync: generate } = useGenerateContent();

  const generations = useLiveQuery(() =>
    db.generations.orderBy("timestamp").reverse().toArray(),
  );

  const handleRegenerate = async (recordId: number, inputData: GenerateInput) => {
    setRegeneratingId(recordId);
    try {
      await generate(inputData);
    } finally {
      setRegeneratingId(null);
    }
  };

  const getBusinessName = (inputData: any): string => {
    return inputData?.businessDescription?.slice(0, 40) ||
      inputData?.businessName ||
      "Unnamed Business";
  };

  const getIndustry = (inputData: any): string => {
    return inputData?.industry || "—";
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">
        {/* Page header */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-border bg-background/80 backdrop-blur-sm">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">History</h1>
          </div>
          <div className="px-3 py-1.5 bg-card rounded-lg border border-border text-xs font-mono text-muted-foreground">
            <span className="font-bold text-primary">{generations?.length || 0}</span> Records
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {generations === undefined ? (
            <div className="flex justify-center items-center h-40">
              <div className="flex flex-col items-center gap-3">
                <div className="w-7 h-7 rounded-full border-[3px] border-primary border-t-transparent animate-spin" />
                <p className="text-sm text-muted-foreground font-mono">Loading...</p>
              </div>
            </div>
          ) : generations.length === 0 ? (
            <div className="flex items-center justify-center h-60">
              <div className="text-center p-8 max-w-sm">
                <Clock className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <h3 className="text-base font-bold text-foreground mb-1.5">No History Yet</h3>
                <p className="text-sm text-muted-foreground">
                  Your generated content will appear here. Head to the Generator to create your first piece.
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="space-y-2">
                {generations.map((record, index) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.05, 0.3) }}
                  >
                    <AccordionItem
                      value={`record-${record.id}`}
                      className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
                    >
                      <AccordionTrigger className="px-5 py-4 hover:bg-muted/30 dark:hover:bg-white/5 transition-colors [&>svg]:shrink-0 [&>svg]:text-muted-foreground">
                        <div className="flex items-center gap-3 text-left flex-1 min-w-0 mr-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-foreground truncate">
                              {getBusinessName(record.inputData)}
                            </p>
                          </div>
                          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-primary/8 dark:bg-primary/15 text-primary text-[11px] font-mono font-semibold border border-primary/20 shrink-0">
                            {getIndustry(record.inputData)}
                          </span>
                          <span className="text-[11px] text-muted-foreground font-mono shrink-0">
                            {formatDistanceToNow(record.timestamp, { addSuffix: true })}
                          </span>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="border-t border-border">
                        {/* Meta bar */}
                        <div className="flex items-center justify-between px-5 py-2.5 bg-muted/20 dark:bg-white/3 border-b border-border/60">
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-mono text-muted-foreground">
                            {(record.inputData as any).brandVoice && (
                              <span><span className="text-muted-foreground/60">Voice:</span> {(record.inputData as any).brandVoice}</span>
                            )}
                            {(record.inputData as any).tone && (
                              <span><span className="text-muted-foreground/60">Tone:</span> {(record.inputData as any).tone}</span>
                            )}
                            {(record.inputData as any).targetAudience && (
                              <span><span className="text-muted-foreground/60">Audience:</span> {(record.inputData as any).targetAudience}</span>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="shrink-0 ml-4 h-7 text-[11px] font-mono gap-1.5 border-primary/30 dark:border-primary/40 text-primary dark:bg-transparent dark:hover:bg-primary/10"
                            disabled={regeneratingId === record.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRegenerate(record.id!, record.inputData);
                            }}
                            data-testid={`button-regenerate-${record.id}`}
                          >
                            {regeneratingId === record.id ? (
                              <><Loader2 className="w-3 h-3 animate-spin" /> Regenerating...</>
                            ) : (
                              <><RefreshCw className="w-3 h-3" /> Re-Generate</>
                            )}
                          </Button>
                        </div>

                        {/* Output */}
                        <div className="p-5">
                          <GeneratedOutput data={record.outputData} />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
