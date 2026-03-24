import { useMutation } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { db, checkRateLimit, DAILY_LIMIT } from "@/lib/db";
import type { GenerateInput, GenerateOutput } from "@shared/schema";

export function useGenerateContent() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: GenerateInput) => {
      // 1. Client-side Rate Limit Check
      const limit = await checkRateLimit();
      if (!limit.allowed) {
        throw new Error(`Daily limit reached. You can only generate ${DAILY_LIMIT} times per 24 hours.`);
      }

      // 2. Parse input securely (though TS ensures types, good practice)
      const validatedInput = api.content.generate.input.parse(data);

      // 3. API Call
      const res = await fetch(api.content.generate.path, {
        method: api.content.generate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedInput),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const errorData = await res.json();
          const parsedError = api.content.generate.responses[400].parse(errorData);
          throw new Error(parsedError.message || "Validation failed");
        }
        throw new Error("Failed to generate content");
      }

      // 4. Parse successful response
      const outputData = api.content.generate.responses[200].parse(await res.json());

      // 5. Save to Dexie Local DB
      await db.generations.add({
        timestamp: Date.now(),
        inputData: validatedInput,
        outputData: outputData,
      });

      return outputData;
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your content has been generated and saved to history.",
      });
    }
  });
}
