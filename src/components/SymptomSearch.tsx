import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Search, Stethoscope, AlertTriangle, Loader2 } from "lucide-react";

interface Medicine {
  id: string;
  name_ar: string;
  scientific_name: string | null;
  primary_use: string | null;
}

interface SymptomSearchProps {
  medicines: Medicine[];
}

export function SymptomSearch({ medicines }: SymptomSearchProps) {
  const [symptoms, setSymptoms] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useLanguage();

  const handleSearch = async () => {
    if (!symptoms.trim()) return;
    
    setLoading(true);
    setError("");
    setSuggestion("");

    try {
      const { data, error: fnError } = await supabase.functions.invoke("suggest-medicine", {
        body: { symptoms, medicines },
      });

      if (fnError) throw fnError;
      
      if (data?.error) {
        setError(data.error);
      } else {
        setSuggestion(data.suggestion);
      }
    } catch (err) {
      console.error("Error suggesting medicine:", err);
      setError(t("suggestionError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Stethoscope className="h-5 w-5 text-primary" />
          {t("symptomSearch")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder={t("symptomPlaceholder")}
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="min-h-[80px] resize-none"
          />
          <Button 
            onClick={handleSearch} 
            disabled={loading || !symptoms.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("searching")}
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                {t("searchBySymptoms")}
              </>
            )}
          </Button>
        </div>

        {/* Medical Disclaimer */}
        <Alert className="border-warning/30 bg-warning/10">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertDescription className="text-sm text-warning">
            {t("medicalDisclaimer")}
          </AlertDescription>
        </Alert>

        {/* Error */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Suggestion Result */}
        {suggestion && (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="pt-4">
              <p className="text-sm font-medium text-primary mb-2">{t("suggestions")}:</p>
              <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {suggestion}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
