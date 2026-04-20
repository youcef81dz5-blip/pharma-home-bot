import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ImageUploader } from "@/components/ImageUploader";
import { AnalysisResults } from "@/components/AnalysisResults";
import { analyzeImage } from "@/lib/gemini";
import { AnalysisResult } from "@/types/analysis";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, ArrowLeft, Sparkles, Info, FileText, Package, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [currentImageBase64, setCurrentImageBase64] = useState<string | null>(null);
  const { toast } = useToast();
  const { t, language, dir } = useLanguage();
  const navigate = useNavigate();
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
            {/* Quick Actions - iOS-style app grid */}
            <div className="mx-auto mb-6 grid max-w-md grid-cols-4 gap-3 sm:gap-4">
              {[
                { to: "/prescriptions", icon: FileText, label: t("prescriptions"), gradient: "from-primary to-primary/70" },
                { to: "/inventory", icon: Package, label: t("inventory"), gradient: "from-accent to-accent/70" },
                { to: "/reminders", icon: BellRing, label: t("reminders"), gradient: "from-secondary to-secondary/70" },
                { to: "/about", icon: Info, label: t("aboutApp"), gradient: "from-muted-foreground/80 to-muted-foreground/50" },
              ].map(({ to, icon: Icon, label, gradient }) => (
                <button
                  key={to}
                  onClick={() => navigate(to)}
                  className="group flex flex-col items-center gap-1.5 focus:outline-none"
                  aria-label={label}
                >
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-soft transition-transform duration-200 group-hover:scale-105 group-active:scale-95 sm:h-16 sm:w-16`}>
                    <Icon className="h-6 w-6 text-primary-foreground sm:h-7 sm:w-7" />
                  </div>
                  <span className="text-[11px] font-medium text-foreground/80 sm:text-xs line-clamp-1">
                    {label}
                  </span>
                </button>
              ))}
            </div>

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
