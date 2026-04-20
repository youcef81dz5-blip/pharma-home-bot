import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Camera, Upload, FileText, Sparkles, ArrowRight, ArrowLeft,
  Pill, AlertTriangle, Clock, CalendarDays, Stethoscope,
  ChevronDown, ChevronUp, Shield, Info, X, ZoomIn, Save, Check
} from "lucide-react";

interface PrescriptionMedicine {
  name: string;
  scientific_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  form: string;
  primary_use: string;
  side_effects: string[];
  contraindications: string[];
  warnings: string[];
  interactions: string[];
  confidence: "high" | "medium" | "low";
}

interface PrescriptionResult {
  medicines: PrescriptionMedicine[];
  diagnosis_summary: string;
  general_advice: string;
  doctor_notes: string;
  prescription_date: string | null;
}

const labels = {
  ar: {
    title: "حلل وصفتك",
    subtitle: "حلل وصفتك الطبية بالذكاء الاصطناعي",
    uploadTitle: "ارفع صورة الوصفة الطبية",
    uploadDesc: "التقط صورة أو ارفع صورة لوصفتك الطبية المكتوبة بخط اليد",
    takePhoto: "التقط صورة",
    uploadImage: "ارفع صورة",
    dragDrop: "أو اسحب وأفلت الصورة هنا",
    analyze: "حلل وصفتك",
    analyzing: "جاري تحليل الوصفة الطبية...",
    analyzingDesc: "الذكاء الاصطناعي يقرأ خط اليد ويحدد الأدوية",
    medicinesFound: "الأدوية المكتشفة",
    details: "تفاصيل",
    hideDetails: "إخفاء",
    backToPrescription: "العودة للوصفة",
    newPrescription: "وصفة جديدة",
    diagnosisSummary: "خلاصة التشخيص",
    generalAdvice: "نصائح عامة",
    doctorNotes: "ملاحظات الطبيب",
    prescriptionDate: "تاريخ الوصفة",
    dosage: "الجرعة",
    frequency: "عدد المرات",
    duration: "المدة",
    form: "الشكل الصيدلاني",
    primaryUse: "الاستخدام الرئيسي",
    sideEffects: "الآثار الجانبية",
    contraindications: "موانع الاستعمال",
    warnings: "تحذيرات",
    interactions: "التفاعلات الدوائية",
    confidence: "دقة القراءة",
    high: "عالية",
    medium: "متوسطة",
    low: "منخفضة",
    disclaimer: "⚠️ هذا التحليل للأغراض المعلوماتية فقط ولا يغني عن استشارة الطبيب أو الصيدلي",
    noMedicines: "لم يتم العثور على أدوية في الصورة",
    error: "خطأ في التحليل",
    success: "تم تحليل الوصفة بنجاح",
    tip: "💡 نصيحة: صوّر الوصفة في إضاءة جيدة وتأكد أن الخط واضح",
    savePrescription: "حفظ الوصفة",
    saving: "جاري الحفظ...",
    saved: "تم حفظ الوصفة بنجاح",
    saveError: "خطأ في حفظ الوصفة",
    loginToSave: "سجل دخولك لحفظ الوصفة",
  },
  en: {
    title: "Analyze Your Prescription",
    subtitle: "Analyze your prescription with AI",
    uploadTitle: "Upload Prescription Image",
    uploadDesc: "Take a photo or upload an image of your handwritten prescription",
    takePhoto: "Take Photo",
    uploadImage: "Upload Image",
    dragDrop: "Or drag and drop image here",
    analyze: "Analyze Your Prescription",
    analyzing: "Analyzing prescription...",
    analyzingDesc: "AI is reading handwriting and identifying medicines",
    medicinesFound: "Medicines Found",
    details: "Details",
    hideDetails: "Hide",
    backToPrescription: "Back to Prescription",
    newPrescription: "New Prescription",
    diagnosisSummary: "Diagnosis Summary",
    generalAdvice: "General Advice",
    doctorNotes: "Doctor's Notes",
    prescriptionDate: "Prescription Date",
    dosage: "Dosage",
    frequency: "Frequency",
    duration: "Duration",
    form: "Pharmaceutical Form",
    primaryUse: "Primary Use",
    sideEffects: "Side Effects",
    contraindications: "Contraindications",
    warnings: "Warnings",
    interactions: "Drug Interactions",
    confidence: "Reading Confidence",
    high: "High",
    medium: "Medium",
    low: "Low",
    disclaimer: "⚠️ This analysis is for informational purposes only and does not replace consulting a doctor or pharmacist",
    noMedicines: "No medicines found in the image",
    error: "Analysis Error",
    success: "Prescription analyzed successfully",
    tip: "💡 Tip: Photograph the prescription in good lighting and ensure the text is clear",
    savePrescription: "Save Prescription",
    saving: "Saving...",
    saved: "Prescription saved successfully",
    saveError: "Error saving prescription",
    loginToSave: "Log in to save prescription",
  },
  fr: {
    title: "Analysez votre ordonnance",
    subtitle: "Analysez votre ordonnance avec l'IA",
    uploadTitle: "Télécharger l'image de l'ordonnance",
    uploadDesc: "Prenez une photo ou téléchargez une image de votre ordonnance manuscrite",
    takePhoto: "Prendre une Photo",
    uploadImage: "Télécharger",
    dragDrop: "Ou glissez-déposez l'image ici",
    analyze: "Analysez votre ordonnance",
    analyzing: "Analyse de l'ordonnance en cours...",
    analyzingDesc: "L'IA lit l'écriture manuscrite et identifie les médicaments",
    medicinesFound: "Médicaments Trouvés",
    details: "Détails",
    hideDetails: "Masquer",
    backToPrescription: "Retour à l'ordonnance",
    newPrescription: "Nouvelle ordonnance",
    diagnosisSummary: "Résumé du Diagnostic",
    generalAdvice: "Conseils Généraux",
    doctorNotes: "Notes du Médecin",
    prescriptionDate: "Date de l'ordonnance",
    dosage: "Dosage",
    frequency: "Fréquence",
    duration: "Durée",
    form: "Forme Pharmaceutique",
    primaryUse: "Utilisation Principale",
    sideEffects: "Effets Secondaires",
    contraindications: "Contre-indications",
    warnings: "Avertissements",
    interactions: "Interactions Médicamenteuses",
    confidence: "Confiance de Lecture",
    high: "Haute",
    medium: "Moyenne",
    low: "Faible",
    disclaimer: "⚠️ Cette analyse est à titre informatif uniquement et ne remplace pas la consultation d'un médecin ou pharmacien",
    noMedicines: "Aucun médicament trouvé dans l'image",
    error: "Erreur d'analyse",
    success: "Ordonnance analysée avec succès",
    tip: "💡 Conseil: Photographiez l'ordonnance avec un bon éclairage",
    savePrescription: "Sauvegarder l'ordonnance",
    saving: "Sauvegarde en cours...",
    saved: "Ordonnance sauvegardée avec succès",
    saveError: "Erreur lors de la sauvegarde",
    loginToSave: "Connectez-vous pour sauvegarder",
  },
  es: {
    title: "Recetas Médicas",
    subtitle: "Analiza tu receta con IA",
    uploadTitle: "Subir Imagen de Receta",
    uploadDesc: "Toma una foto o sube una imagen de tu receta manuscrita",
    takePhoto: "Tomar Foto",
    uploadImage: "Subir Imagen",
    dragDrop: "O arrastra y suelta la imagen aquí",
    analyze: "Analiza tu Receta",
    analyzing: "Analizando receta...",
    analyzingDesc: "La IA está leyendo la escritura e identificando medicamentos",
    medicinesFound: "Medicamentos Encontrados",
    details: "Detalles",
    hideDetails: "Ocultar",
    backToPrescription: "Volver a la Receta",
    newPrescription: "Nueva Receta",
    diagnosisSummary: "Resumen del Diagnóstico",
    generalAdvice: "Consejos Generales",
    doctorNotes: "Notas del Médico",
    prescriptionDate: "Fecha de la Receta",
    dosage: "Dosis",
    frequency: "Frecuencia",
    duration: "Duración",
    form: "Forma Farmacéutica",
    primaryUse: "Uso Principal",
    sideEffects: "Efectos Secundarios",
    contraindications: "Contraindicaciones",
    warnings: "Advertencias",
    interactions: "Interacciones Medicamentosas",
    confidence: "Confianza de Lectura",
    high: "Alta",
    medium: "Media",
    low: "Baja",
    disclaimer: "⚠️ Este análisis es solo informativo y no reemplaza la consulta con un médico o farmacéutico",
    noMedicines: "No se encontraron medicamentos en la imagen",
    error: "Error de análisis",
    success: "Receta analizada con éxito",
    tip: "💡 Consejo: Fotografía la receta con buena iluminación",
    savePrescription: "Guardar Receta",
    saving: "Guardando...",
    saved: "Receta guardada con éxito",
    saveError: "Error al guardar la receta",
    loginToSave: "Inicia sesión para guardar",
  },
};

const Prescriptions = () => {
  const { language, dir } = useLanguage();
  const { toast } = useToast();
  const l = labels[language];

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PrescriptionResult | null>(null);
  const [expandedMedicine, setExpandedMedicine] = useState<number | null>(null);
  const [showPrescriptionImage, setShowPrescriptionImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);
      const base64 = dataUrl.split(",")[1];
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleAnalyze = async () => {
    if (!imageBase64) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-prescription", {
        body: { imageBase64, language },
      });

      if (error) throw error;

      setResult(data);
      toast({ title: l.success });
    } catch (error) {
      console.error("Prescription analysis error:", error);
      toast({
        variant: "destructive",
        title: l.error,
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setImagePreview(null);
    setImageBase64(null);
    setResult(null);
    setExpandedMedicine(null);
    setShowPrescriptionImage(false);
    setIsSaved(false);
  };

  const handleSave = async () => {
    if (!result) return;
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ variant: "destructive", title: l.loginToSave });
        return;
      }
      const { error } = await supabase.from("saved_prescriptions" as any).insert({
        user_id: user.id,
        prescription_date: result.prescription_date,
        doctor_name: result.doctor_notes || null,
        diagnosis_summary: result.diagnosis_summary,
        general_advice: result.general_advice,
        doctor_notes: result.doctor_notes,
        medicines: result.medicines,
      } as any);
      if (error) throw error;
      setIsSaved(true);
      toast({ title: l.saved });
    } catch (error) {
      console.error("Save error:", error);
      toast({ variant: "destructive", title: l.saveError });
    } finally {
      setIsSaving(false);
    }
  };

  const getConfidenceBadge = (confidence: string) => {
    const map: Record<string, { color: string; label: string }> = {
      high: { color: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30", label: l.high },
      medium: { color: "bg-amber-500/15 text-amber-600 border-amber-500/30", label: l.medium },
      low: { color: "bg-red-500/15 text-red-600 border-red-500/30", label: l.low },
    };
    const { color, label } = map[confidence] || map.medium;
    return <Badge variant="outline" className={`${color} text-xs font-semibold`}>{label}</Badge>;
  };

  const ArrowIcon = dir === "rtl" ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <Header />

      <main className="container pb-20 pt-6 max-w-2xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">{l.title}</h1>
          <p className="text-muted-foreground mt-2">{l.subtitle}</p>
        </div>

        {!result ? (
          <>
            {/* Upload Area */}
            <Card
              className={`p-8 border-2 border-dashed transition-all duration-300 ${
                isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-border hover:border-primary/50"
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
            >
              {!imagePreview ? (
                <div className="flex flex-col items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-primary" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-foreground">{l.uploadTitle}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{l.uploadDesc}</p>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={() => cameraInputRef.current?.click()} className="gap-2" size="lg">
                      <Camera className="w-5 h-5" />
                      {l.takePhoto}
                    </Button>
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2" size="lg">
                      <Upload className="w-5 h-5" />
                      {l.uploadImage}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">{l.dragDrop}</p>
                  <p className="text-xs text-muted-foreground/70">{l.tip}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-full max-w-md rounded-xl overflow-hidden shadow-lg">
                    <img src={imagePreview} alt="Prescription" className="w-full h-auto" />
                    <button
                      onClick={() => { setImagePreview(null); setImageBase64(null); }}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 shadow-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <Button onClick={handleAnalyze} disabled={isLoading} size="lg" className="gap-2 text-lg px-8">
                    <Sparkles className="w-5 h-5" />
                    {l.analyze}
                  </Button>
                </div>
              )}

              <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </Card>

            {/* Loading */}
            {isLoading && (
              <div className="mt-8 flex flex-col items-center gap-4 fade-in-up">
                <div className="relative flex h-20 w-20 items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                  <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <Stethoscope className="h-8 w-8 text-primary pulse-ring" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground">{l.analyzing}</p>
                  <p className="text-sm text-muted-foreground">{l.analyzingDesc}</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-6 fade-in-up">
            {/* Top Actions */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
                <ArrowIcon className="w-4 h-4" />
                {l.newPrescription}
              </Button>
              <div className="flex gap-2">
                {imagePreview && (
                  <Button variant="ghost" size="sm" onClick={() => setShowPrescriptionImage(!showPrescriptionImage)} className="gap-2">
                    <ZoomIn className="w-4 h-4" />
                    {l.backToPrescription}
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving || isSaved}
                  className="gap-2"
                  variant={isSaved ? "outline" : "default"}
                >
                  {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {isSaving ? l.saving : isSaved ? l.saved : l.savePrescription}
                </Button>
              </div>
            </div>

            {/* Show prescription image */}
            {showPrescriptionImage && imagePreview && (
              <Card className="p-4 fade-in-up">
                <img src={imagePreview} alt="Prescription" className="w-full h-auto rounded-lg" />
              </Card>
            )}

            {/* Diagnosis Summary */}
            {result.diagnosis_summary && (
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/10 border-primary/20">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <Stethoscope className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg mb-2">{l.diagnosisSummary}</h3>
                    <p className="text-foreground/80 leading-relaxed">{result.diagnosis_summary}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Prescription Info */}
            {(result.prescription_date || result.doctor_notes) && (
              <div className="flex gap-3 flex-wrap">
                {result.prescription_date && (
                  <Badge variant="outline" className="gap-1 px-3 py-1.5 text-sm">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {l.prescriptionDate}: {result.prescription_date}
                  </Badge>
                )}
              </div>
            )}

            {/* Medicines List */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Pill className="w-5 h-5 text-primary" />
                {l.medicinesFound} ({result.medicines.length})
              </h2>

              {result.medicines.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">{l.noMedicines}</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {result.medicines.map((med, i) => (
                    <Card key={i} className="overflow-hidden transition-all duration-300 hover:shadow-md">
                      {/* Medicine Header */}
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Pill className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-foreground text-base truncate">{med.name}</h3>
                            {med.scientific_name && (
                              <p className="text-xs text-muted-foreground truncate">{med.scientific_name}</p>
                            )}
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              {med.dosage && (
                                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">{med.dosage}</span>
                              )}
                              {med.frequency && (
                                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Clock className="w-3 h-3" />{med.frequency}
                                </span>
                              )}
                              {getConfidenceBadge(med.confidence)}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedMedicine(expandedMedicine === i ? null : i)}
                          className="gap-1 flex-shrink-0"
                        >
                          {expandedMedicine === i ? (
                            <><ChevronUp className="w-4 h-4" />{l.hideDetails}</>
                          ) : (
                            <><ChevronDown className="w-4 h-4" />{l.details}</>
                          )}
                        </Button>
                      </div>

                      {/* Expanded Details */}
                      {expandedMedicine === i && (
                        <div className="border-t border-border p-4 space-y-4 bg-muted/30 fade-in-up">
                          {/* Basic Info Grid */}
                          <div className="grid grid-cols-2 gap-3">
                            {med.form && (
                              <InfoItem icon={<Pill className="w-4 h-4" />} label={l.form} value={med.form} />
                            )}
                            {med.dosage && (
                              <InfoItem icon={<Info className="w-4 h-4" />} label={l.dosage} value={med.dosage} />
                            )}
                            {med.frequency && (
                              <InfoItem icon={<Clock className="w-4 h-4" />} label={l.frequency} value={med.frequency} />
                            )}
                            {med.duration && (
                              <InfoItem icon={<CalendarDays className="w-4 h-4" />} label={l.duration} value={med.duration} />
                            )}
                          </div>

                          {/* Primary Use */}
                          {med.primary_use && (
                            <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                              <p className="text-xs font-semibold text-primary mb-1">{l.primaryUse}</p>
                              <p className="text-sm text-foreground">{med.primary_use}</p>
                            </div>
                          )}

                          {/* Side Effects */}
                          {med.side_effects?.length > 0 && (
                            <DetailSection
                              icon={<AlertTriangle className="w-4 h-4" />}
                              label={l.sideEffects}
                              items={med.side_effects}
                              variant="warning"
                            />
                          )}

                          {/* Contraindications */}
                          {med.contraindications?.length > 0 && (
                            <DetailSection
                              icon={<Shield className="w-4 h-4" />}
                              label={l.contraindications}
                              items={med.contraindications}
                              variant="danger"
                            />
                          )}

                          {/* Warnings */}
                          {med.warnings?.length > 0 && (
                            <DetailSection
                              icon={<AlertTriangle className="w-4 h-4" />}
                              label={l.warnings}
                              items={med.warnings}
                              variant="danger"
                            />
                          )}

                          {/* Interactions */}
                          {med.interactions?.length > 0 && (
                            <DetailSection
                              icon={<Pill className="w-4 h-4" />}
                              label={l.interactions}
                              items={med.interactions}
                              variant="info"
                            />
                          )}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Doctor Notes */}
            {result.doctor_notes && (
              <Card className="p-5 border-border">
                <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4 text-muted-foreground" />
                  {l.doctorNotes}
                </h3>
                <p className="text-sm text-foreground/80">{result.doctor_notes}</p>
              </Card>
            )}

            {/* General Advice */}
            {result.general_advice && (
              <Card className="p-5 bg-accent/30 border-accent">
                <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  {l.generalAdvice}
                </h3>
                <p className="text-sm text-foreground/80 leading-relaxed">{result.general_advice}</p>
              </Card>
            )}

            {/* Disclaimer */}
            <p className="text-xs text-muted-foreground text-center px-4">{l.disclaimer}</p>
          </div>
        )}
      </main>
    </div>
  );
};

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-card border border-border">
      <span className="text-muted-foreground mt-0.5">{icon}</span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function DetailSection({
  icon, label, items, variant,
}: {
  icon: React.ReactNode;
  label: string;
  items: string[];
  variant: "warning" | "danger" | "info";
}) {
  const variantStyles = {
    warning: "bg-amber-500/5 border-amber-500/15 text-amber-700 dark:text-amber-400",
    danger: "bg-red-500/5 border-red-500/15 text-red-700 dark:text-red-400",
    info: "bg-blue-500/5 border-blue-500/15 text-blue-700 dark:text-blue-400",
  };

  return (
    <div className={`p-3 rounded-xl border ${variantStyles[variant]}`}>
      <p className="text-xs font-semibold mb-2 flex items-center gap-1">{icon} {label}</p>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-foreground/80 flex items-start gap-1.5">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Prescriptions;
