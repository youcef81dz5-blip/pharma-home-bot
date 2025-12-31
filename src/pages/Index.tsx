import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ImageUploader } from "@/components/ImageUploader";
import { AnalysisResults } from "@/components/AnalysisResults";
import { analyzeImage } from "@/lib/gemini";
import { AnalysisResult } from "@/types/analysis";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [currentImageBase64, setCurrentImageBase64] = useState<string | null>(null);
  const { toast } = useToast();
  const { t, language, dir } = useLanguage();

  const handleImageSelect = async (base64: string) => {
    setIsLoading(true);
    setResult(null);
    setCurrentImageBase64(base64);

    try {
      const analysisResult = await analyzeImage(base64);
      setResult(analysisResult);
      toast({
        title: t("analysisSuccess"),
        description: t("analysisSuccessDesc"),
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        variant: "destructive",
        title: t("analysisError"),
        description:
          error instanceof Error
            ? error.message
            : language === "ar" 
              ? "حدث خطأ أثناء تحليل الصورة. يرجى المحاولة مرة أخرى."
              : language === "fr"
              ? "Une erreur s'est produite lors de l'analyse. Veuillez réessayer."
              : "An error occurred during analysis. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setResult(null);
    setCurrentImageBase64(null);
  };

  const ArrowIcon = dir === "rtl" ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-background" dir={dir}>
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
                  <p className="font-semibold text-foreground">{t("analyzingImage")}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("extractingIngredients")}
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">{t("analysisResults")}</h2>
              <Button variant="outline" size="sm" onClick={handleNewAnalysis}>
                <ArrowIcon className="h-4 w-4" />
                {t("newAnalysis")}
              </Button>
            </div>
            <AnalysisResults result={result} imageBase64={currentImageBase64 || undefined} />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-6">
        <div className="container text-center">
          <p className="text-sm font-medium text-foreground">
            {t("developedBy")}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            {t("disclaimer")}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
