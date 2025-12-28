import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ImageUploader } from "@/components/ImageUploader";
import { AnalysisResults } from "@/components/AnalysisResults";
import { analyzeImage } from "@/lib/gemini";
import { AnalysisResult } from "@/types/analysis";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleImageSelect = async (base64: string) => {
    setIsLoading(true);
    setResult(null);

    try {
      const analysisResult = await analyzeImage(base64);
      setResult(analysisResult);
      toast({
        title: "تم التحليل بنجاح",
        description: "تم تحليل صورة الدواء واستخراج المعلومات",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        variant: "destructive",
        title: "خطأ في التحليل",
        description:
          error instanceof Error
            ? error.message
            : "حدث خطأ أثناء تحليل الصورة. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container pb-20 pt-6">
        {!result ? (
          <>
            <HeroSection />
            <div className="mt-8">
              <ImageUploader onImageSelect={handleImageSelect} isLoading={isLoading} />
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="mt-8 flex flex-col items-center gap-4 fade-in-up">
                <div className="relative flex h-20 w-20 items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                  <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <Sparkles className="h-8 w-8 text-primary pulse-ring" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground">جاري تحليل الصورة...</p>
                  <p className="text-sm text-muted-foreground">
                    يتم استخراج المكونات وتحليلها بالذكاء الاصطناعي
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">نتائج التحليل</h2>
              <Button variant="outline" size="sm" onClick={handleNewAnalysis}>
                <ArrowRight className="h-4 w-4" />
                تحليل جديد
              </Button>
            </div>
            <AnalysisResults result={result} />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-6">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            صيدلي البيت © {new Date().getFullYear()} - جميع الحقوق محفوظة
          </p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            هذا التطبيق للأغراض المعلوماتية فقط ولا يغني عن استشارة الطبيب
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
