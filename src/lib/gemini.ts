import { AnalysisResult } from "@/types/analysis";
import { supabase } from "@/integrations/supabase/client";

/**
 * Analyze a product image via the secure `analyze-image` Edge Function.
 * The Gemini API key is kept server-side; this client only forwards the
 * authenticated user's request.
 */
export async function analyzeImage(imageBase64: string): Promise<AnalysisResult> {
  const { data, error } = await supabase.functions.invoke("analyze-image", {
    body: { imageBase64 },
  });

  if (error) {
    console.error("analyze-image error:", error);
    throw new Error(error.message || "فشل في تحليل الصورة. يرجى المحاولة مرة أخرى.");
  }
  if (!data || (data as any).error) {
    throw new Error((data as any)?.error || "فشل في تحليل الصورة.");
  }
  return data as AnalysisResult;
}

export function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
