import { useState } from "react";
import { AnalysisResult } from "@/types/analysis";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ShieldAlert,
  Pill,
  FileWarning,
  Stethoscope,
  Info,
  PackagePlus,
  Loader2,
  Syringe,
  Timer,
  BookOpen,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface AnalysisResultsProps {
  result: AnalysisResult;
  imageBase64?: string;
}

const translations = {
  ar: {
    addToInventory: "إضافة للمخزون",
    adding: "جاري الإضافة...",
    addSuccess: "تمت إضافة الدواء للمخزون بنجاح",
    addError: "حدث خطأ أثناء الإضافة",
    loginRequired: "يجب تسجيل الدخول أولاً",
    goToLogin: "تسجيل الدخول",
    findAlternative: "ابحث عن بديل",
    searchingAlt: "جاري البحث...",
    alternativeFound: "البدائل المتاحة",
    noAlternative: "لم يتم العثور على بدائل",
    alternativeError: "خطأ في البحث عن البدائل",
  },
  en: {
    addToInventory: "Add to Inventory",
    adding: "Adding...",
    addSuccess: "Medicine added to inventory successfully",
    addError: "Error adding medicine",
    loginRequired: "Please login first",
    goToLogin: "Go to Login",
    findAlternative: "Find Alternative",
    searchingAlt: "Searching...",
    alternativeFound: "Available Alternatives",
    noAlternative: "No alternatives found",
    alternativeError: "Error searching for alternatives",
  },
  fr: {
    addToInventory: "Ajouter à l'inventaire",
    adding: "Ajout en cours...",
    addSuccess: "Médicament ajouté avec succès",
    addError: "Erreur lors de l'ajout",
    loginRequired: "Veuillez vous connecter",
    goToLogin: "Se connecter",
    findAlternative: "Trouver une alternative",
    searchingAlt: "Recherche...",
    alternativeFound: "Alternatives disponibles",
    noAlternative: "Aucune alternative trouvée",
    alternativeError: "Erreur de recherche",
  },
};

interface Alternative {
  name: string;
  scientific_name: string;
  manufacturer: string;
  reason: string;
}

export function AnalysisResults({ result, imageBase64 }: AnalysisResultsProps) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [isSearchingAlt, setIsSearchingAlt] = useState(false);
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const t = translations[language];

  const getExpiryStatusColor = (status: string) => {
    switch (status) {
      case "آمن":
        return "ingredient-positive";
      case "يقترب من الانتهاء":
        return "ingredient-suspicious";
      case "منتهي":
        return "ingredient-negative";
      default:
        return "bg-muted";
    }
  };

  const getAlertIcon = (priority: string) => {
    switch (priority) {
      case "High":
        return <XCircle className="h-5 w-5" />;
      case "Medium":
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <CheckCircle2 className="h-5 w-5" />;
    }
  };

  const parseExpiryDate = (dateStr: string): string | null => {
    // Try to parse various date formats
    const formats = [
      /(\d{4})-(\d{2})-(\d{2})/, // YYYY-MM-DD
      /(\d{2})\/(\d{2})\/(\d{4})/, // DD/MM/YYYY
      /(\d{2})-(\d{2})-(\d{4})/, // DD-MM-YYYY
    ];
    
    for (const format of formats) {
      const match = dateStr.match(format);
      if (match) {
        if (format === formats[0]) {
          return `${match[1]}-${match[2]}-${match[3]}`;
        } else {
          return `${match[3]}-${match[2]}-${match[1]}`;
        }
      }
    }
    return null;
  };

  const handleAddToInventory = async () => {
    setIsAdding(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error(t.loginRequired, {
          action: {
            label: t.goToLogin,
            onClick: () => navigate("/auth"),
          },
        });
        setIsAdding(false);
        return;
      }

      const expiryDate = parseExpiryDate(result.expiry_analytics.expiry_date);

      const { error } = await supabase.from("medicine_inventory").insert({
        user_id: user.id,
        name_ar: result.product_summary.name_ar,
        scientific_name: result.product_summary.scientific_name,
        manufacturer: result.product_summary.manufacturer,
        primary_use: result.product_summary.primary_use,
        expiry_date: expiryDate,
        quantity: 1,
        image_url: imageBase64 || null,
        notes: result.detailed_medical_report.indications.join("، "),
      });

      if (error) throw error;

      toast.success(t.addSuccess);
    } catch (error) {
      console.error("Error adding to inventory:", error);
      toast.error(t.addError);
    } finally {
      setIsAdding(false);
    }
  };

  const handleFindAlternatives = async () => {
    setIsSearchingAlt(true);
    setShowAlternatives(false);
    
    try {
      const { data, error } = await supabase.functions.invoke('find-alternatives', {
        body: {
          medicineName: result.product_summary.name_ar,
          scientificName: result.product_summary.scientific_name,
          primaryUse: result.product_summary.primary_use,
        }
      });

      if (error) throw error;

      if (data.alternatives && data.alternatives.length > 0) {
        setAlternatives(data.alternatives);
        setShowAlternatives(true);
      } else {
        toast.info(t.noAlternative);
      }
    } catch (error) {
      console.error("Error finding alternatives:", error);
      toast.error(t.alternativeError);
    } finally {
      setIsSearchingAlt(false);
    }
  };

  return (
    <div className="space-y-6 fade-in-up">
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <Button 
          onClick={handleAddToInventory} 
          disabled={isAdding}
          className="w-full sm:w-auto gap-2"
          size="lg"
        >
          {isAdding ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <PackagePlus className="h-5 w-5" />
          )}
          {isAdding ? t.adding : t.addToInventory}
        </Button>
        
        <Button 
          onClick={handleFindAlternatives} 
          disabled={isSearchingAlt}
          variant="outline"
          className="w-full sm:w-auto gap-2 border-primary/30 hover:bg-primary/10"
          size="lg"
        >
          {isSearchingAlt ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <RefreshCw className="h-5 w-5" />
          )}
          {isSearchingAlt ? t.searchingAlt : t.findAlternative}
        </Button>
      </div>

      {/* Alternatives Section */}
      {showAlternatives && alternatives.length > 0 && (
        <section className="glass-card rounded-2xl p-5 border-2 border-primary/30 bg-primary/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <RefreshCw className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">{t.alternativeFound}</h2>
          </div>
          <div className="space-y-3">
            {alternatives.map((alt, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-background/50 border border-primary/20 slide-in-right"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <h3 className="font-semibold text-primary text-lg">{alt.name}</h3>
                <p className="text-sm text-muted-foreground">{alt.scientific_name}</p>
                {alt.manufacturer && (
                  <p className="text-xs text-muted-foreground mt-1">الشركة: {alt.manufacturer}</p>
                )}
                <p className="text-sm mt-2 text-foreground">{alt.reason}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 rounded-xl bg-warning/10 border-2 border-warning/50">
            <p className="text-base text-warning font-bold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              ⚠️ استشر الصيدلي قبل استخدام أي بديل
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              هذه البدائل تحتوي على نفس المادة الفعالة، لكن قد تختلف في التركيز أو الشكل الصيدلاني
            </p>
          </div>
        </section>
      )}

      {/* Product Summary */}
      <section className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Pill className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">معلومات المنتج</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoRow label="الاسم" value={result.product_summary.name_ar} />
          <InfoRow label="الاسم العلمي" value={result.product_summary.scientific_name} />
          <InfoRow label="الشركة المصنعة" value={result.product_summary.manufacturer} />
          <InfoRow label="الاستخدام الأساسي" value={result.product_summary.primary_use} />
        </div>
      </section>

      {/* Expiry Analytics */}
      <section className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
            <Clock className="h-5 w-5 text-warning" />
          </div>
          <h2 className="text-xl font-bold text-foreground">تحليل الصلاحية</h2>
        </div>
        <div
          className={cn(
            "flex items-center justify-between rounded-xl border p-4",
            getExpiryStatusColor(result.expiry_analytics.status)
          )}
        >
          <div className="space-y-1">
            <p className="font-semibold">{result.expiry_analytics.status}</p>
            <p className="text-sm opacity-80">
              تاريخ الانتهاء: {result.expiry_analytics.expiry_date}
            </p>
            <p className="text-sm opacity-80">
              الأيام المتبقية: {result.expiry_analytics.days_remaining}
            </p>
          </div>
          {getAlertIcon(result.expiry_analytics.alert_priority)}
        </div>
      </section>

      {/* Ingredients Classification */}
      <section className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
            <ShieldAlert className="h-5 w-5 text-success" />
          </div>
          <h2 className="text-xl font-bold text-foreground">تصنيف المكونات</h2>
        </div>

        {/* Positive Ingredients */}
        {result.ingredients_classification.positive_ingredients.length > 0 && (
          <div className="mb-4">
            <h3 className="mb-2 flex items-center gap-2 font-semibold text-success">
              <CheckCircle2 className="h-4 w-4" />
              مكونات إيجابية
            </h3>
            <div className="space-y-2">
              {result.ingredients_classification.positive_ingredients.map((ing, idx) => (
                <div
                  key={idx}
                  className="ingredient-positive rounded-xl border p-3 slide-in-right"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <p className="font-medium">{ing.name}</p>
                  <p className="text-sm opacity-80">{ing.benefit}</p>
                  {ing.evidence_level && (
                    <span className="mt-1 inline-block rounded-full bg-success/20 px-2 py-0.5 text-xs">
                      مستوى الدليل: {ing.evidence_level}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Negative Ingredients */}
        {result.ingredients_classification.negative_ingredients.length > 0 && (
          <div className="mb-4">
            <h3 className="mb-2 flex items-center gap-2 font-semibold text-destructive">
              <XCircle className="h-4 w-4" />
              مكونات تحمل تحذيراً
            </h3>
            <div className="space-y-2">
              {result.ingredients_classification.negative_ingredients.map((ing, idx) => (
                <div
                  key={idx}
                  className="ingredient-negative rounded-xl border p-3 slide-in-right"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <p className="font-medium">{ing.name}</p>
                  <p className="text-sm opacity-80">{ing.risk}</p>
                  {ing.side_effects.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {ing.side_effects.map((effect, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-destructive/20 px-2 py-0.5 text-xs"
                        >
                          {effect}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suspicious Ingredients */}
        {result.ingredients_classification.suspicious_ingredients.length > 0 && (
          <div>
            <h3 className="mb-2 flex items-center gap-2 font-semibold" style={{ color: "hsl(var(--warning))" }}>
              <AlertTriangle className="h-4 w-4" />
              مكونات مشكوك فيها
            </h3>
            <div className="space-y-2">
              {result.ingredients_classification.suspicious_ingredients.map((ing, idx) => (
                <div
                  key={idx}
                  className="ingredient-suspicious rounded-xl border p-3 slide-in-right"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <p className="font-medium">{ing.name}</p>
                  <p className="text-sm opacity-80">{ing.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Marketing Audit */}
      {(result.marketing_audit.deceptive_claims.length > 0 ||
        result.marketing_audit.scientific_fact_check) && (
        <section className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
              <FileWarning className="h-5 w-5 text-destructive" />
            </div>
            <h2 className="text-xl font-bold text-foreground">تدقيق الادعاءات التسويقية</h2>
          </div>
          {result.marketing_audit.deceptive_claims.length > 0 && (
            <div className="mb-3">
              <p className="mb-2 text-sm font-medium text-muted-foreground">
                ادعاءات مضللة محتملة:
              </p>
              <ul className="list-inside list-disc space-y-1 text-destructive">
                {result.marketing_audit.deceptive_claims.map((claim, idx) => (
                  <li key={idx} className="text-sm">{claim}</li>
                ))}
              </ul>
            </div>
          )}
          {result.marketing_audit.scientific_fact_check && (
            <p className="text-sm text-muted-foreground">
              {result.marketing_audit.scientific_fact_check}
            </p>
          )}
        </section>
      )}

      {/* Dosage Information */}
      {result.detailed_medical_report.dosage_info && (
        <section className="glass-card rounded-2xl p-5 border-2 border-primary/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Syringe className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">💊 الجرعات الموصى بها</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoRow label="جرعة البالغين" value={result.detailed_medical_report.dosage_info.adult_dose} />
            <InfoRow label="جرعة الأطفال" value={result.detailed_medical_report.dosage_info.child_dose} />
            <InfoRow label="الحد الأقصى اليومي" value={result.detailed_medical_report.dosage_info.max_daily_dose} />
            <InfoRow label="عدد المرات يومياً" value={result.detailed_medical_report.dosage_info.frequency} />
            <InfoRow label="مدة العلاج" value={result.detailed_medical_report.dosage_info.duration} />
          </div>
          <div className="mt-4 p-3 rounded-xl bg-destructive/10 border border-destructive/30">
            <p className="text-sm text-destructive font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              تحذير: لا تتجاوز الجرعة الموصى بها. استشر الطبيب قبل تغيير الجرعة.
            </p>
          </div>
        </section>
      )}

      {/* Usage Instructions */}
      {result.detailed_medical_report.usage_instructions && (
        <section className="glass-card rounded-2xl p-5 border-2 border-success/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
              <BookOpen className="h-5 w-5 text-success" />
            </div>
            <h2 className="text-xl font-bold text-foreground">📋 طريقة الاستعمال الآمنة</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 mb-4">
            <InfoRow label="طريقة التناول" value={result.detailed_medical_report.usage_instructions.administration_method} />
            <InfoRow label="أفضل وقت" value={result.detailed_medical_report.usage_instructions.best_time_to_take} />
            <InfoRow label="مع الطعام" value={result.detailed_medical_report.usage_instructions.with_food} />
          </div>
          
          {result.detailed_medical_report.usage_instructions.special_instructions?.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                <Timer className="h-4 w-4" />
                تعليمات خاصة
              </h4>
              <ul className="list-inside list-disc space-y-1">
                {result.detailed_medical_report.usage_instructions.special_instructions.map((inst, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground">{inst}</li>
                ))}
              </ul>
            </div>
          )}
          
          {result.detailed_medical_report.usage_instructions.warnings?.length > 0 && (
            <div className="p-3 rounded-xl bg-warning/10 border border-warning/30">
              <h4 className="text-sm font-semibold text-warning mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                تحذيرات السلامة
              </h4>
              <ul className="list-inside list-disc space-y-1">
                {result.detailed_medical_report.usage_instructions.warnings.map((warn, idx) => (
                  <li key={idx} className="text-sm text-warning">{warn}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* Medical Report */}
      <section className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Stethoscope className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">التقرير الطبي المفصل</h2>
        </div>

        <div className="space-y-4">
          <ReportSection
            title="دواعي الاستعمال"
            items={result.detailed_medical_report.indications}
            variant="positive"
          />
          <ReportSection
            title="موانع الاستعمال"
            items={result.detailed_medical_report.contraindications}
            variant="negative"
          />
          <ReportSection
            title="أعراض جانبية شائعة"
            items={result.detailed_medical_report.common_side_effects}
            variant="warning"
          />
          <ReportSection
            title="مخاطر نادرة وخطيرة"
            items={result.detailed_medical_report.rare_serious_risks}
            variant="negative"
          />
        </div>
      </section>

      {/* Disclaimer */}
      <section className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-5">
        <div className="flex gap-3">
          <Info className="h-6 w-6 shrink-0 text-primary" />
          <p className="text-sm leading-relaxed text-foreground">
            {result.safety_disclaimer}
          </p>
        </div>
      </section>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function ReportSection({
  title,
  items,
  variant,
}: {
  title: string;
  items: string[];
  variant: "positive" | "negative" | "warning";
}) {
  if (!items || items.length === 0) return null;

  const variantStyles = {
    positive: "text-success",
    negative: "text-destructive",
    warning: "text-warning",
  };

  return (
    <div>
      <h4 className={cn("mb-2 text-sm font-semibold", variantStyles[variant])}>
        {title}
      </h4>
      <ul className="list-inside list-disc space-y-1">
        {items.map((item, idx) => (
          <li key={idx} className="text-sm text-muted-foreground">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
