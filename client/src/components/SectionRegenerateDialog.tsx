import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";

interface SectionRegenerateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionName: string;
  onConfirm: (feedback: string) => void;
  isRegenerating: boolean;
}

export function SectionRegenerateDialog({
  open,
  onOpenChange,
  sectionName,
  onConfirm,
  isRegenerating,
}: SectionRegenerateDialogProps) {
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!open) {
      setFeedback("");
    }
  }, [open]);

  const handleConfirm = () => {
    onConfirm(feedback.trim());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Regenerate {sectionName}
          </DialogTitle>
          <DialogDescription>
            Are you looking for a specific change or tone? Let us know what you want
            improved, and we'll regenerate this section for you.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="E.g., Make it more enthusiastic, shorten the text, focus more on our AI capabilities..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isRegenerating}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={isRegenerating || !feedback.trim()}
            className="bg-gradient-to-r from-primary to-secondary text-white"
          >
            {isRegenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              "Regenerate"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
