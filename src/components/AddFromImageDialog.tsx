import { useState, useRef, useCallback } from "react";
import { Camera, Upload, X, Loader2, ImageIcon, Lightbulb, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { analyzeImage } from "@/lib/gemini";
import { cn } from "@/lib/utils";

interface AddFromImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const labels = {
  ar: {
    title: "إضافة دواء من صورة",
    uploadTitle: "ارفع صورة الدواء",
    dragHint: "اسحب الصورة هنا أو اختر من الخيارات أدناه",
    uploadBtn: "رفع صورة",
    cameraBtn: "التقاط بالكاميرا",
    analyzing: "جاري التحليل والإضافة...",
    analyze: "تحليل وإضافة للمخزون",
    photoTip: "نصيحة للتصوير الأمثل",
    photoTipText: "تأكد من إضاءة جيدة وتجنب الظلال. صوّر المكونات بشكل واضح مع تجنب تأثير Vignette (الحواف الداكنة).",
    success: "تم إضافة الدواء",
    successDesc: "تم تحليل الصورة وإضافة الدواء للمخزون بنجاح",
    error: "خطأ",
    loginRequired: "يجب تسجيل الدخول أولاً",
  },
  en: {
    title: "Add Medicine from Image",
    uploadTitle: "Upload Medicine Image",
    dragHint: "Drag image here or choose from options below",
    uploadBtn: "Upload Image",
    cameraBtn: "Take Photo",
    analyzing: "Analyzing and adding...",
    analyze: "Analyze & Add to Inventory",
    photoTip: "Photo Tips",
    photoTipText: "Ensure good lighting and avoid shadows. Capture ingredients clearly without vignette effect (dark edges).",
    success: "Medicine Added",
    successDesc: "Image analyzed and medicine added to inventory successfully",
    error: "Error",
    loginRequired: "Please login first",
  },
  fr: {
    title: "Ajouter un Médicament depuis une Image",
    uploadTitle: "Télécharger l'Image du Médicament",
    dragHint: "Glissez l'image ici ou choisissez parmi les options ci-dessous",
    uploadBtn: "Télécharger",
    cameraBtn: "Prendre une Photo",
    analyzing: "Analyse et ajout en cours...",
    analyze: "Analyser et Ajouter à l'Inventaire",
    photoTip: "Conseils Photo",
    photoTipText: "Assurez un bon éclairage et évitez les ombres. Capturez les ingrédients clairement sans effet vignette.",
    success: "Médicament Ajouté",
    successDesc: "Image analysée et médicament ajouté à l'inventaire avec succès",
    error: "Erreur",
    loginRequired: "Veuillez d'abord vous connecter",
  },
};

export function AddFromImageDialog({ open, onOpenChange, onSuccess }: AddFromImageDialogProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { language } = useLanguage();
  const { toast } = useToast();
  const l = labels[language];

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPreview(base64);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const clearPreview = useCallback(() => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  }, []);

  const parseExpiryDate = (expiryStr: string | undefined): string | null => {
    if (!expiryStr) return null;
    
    const datePatterns = [
      /(\d{4})-(\d{2})-(\d{2})/,
      /(\d{2})\/(\d{4})/,
      /(\d{2})-(\d{4})/,
    ];
    
    for (const pattern of datePatterns) {
      const match = expiryStr.match(pattern);
      if (match) {
        if (match.length === 4) {
          return `${match[1]}-${match[2]}-${match[3]}`;
        } else if (match.length === 3) {
          return `${match[2]}-${match[1]}-01`;
        }
      }
    }
    
    return null;
  };

  const handleAnalyzeAndAdd = async () => {
    if (!preview) return;

    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          variant: "destructive",
          title: l.error,
          description: l.loginRequired,
        });
        return;
      }

      const result = await analyzeImage(preview);

      const expiryDate = parseExpiryDate(result.expiry_analytics?.expiry_date);
      const indications = result.detailed_medical_report?.indications?.join("، ") || null;

      const { error } = await supabase.from("medicine_inventory").insert({
        user_id: user.id,
        name_ar: result.product_summary?.name_ar || "دواء غير معروف",
        scientific_name: result.product_summary?.scientific_name || null,
        manufacturer: result.product_summary?.manufacturer || null,
        primary_use: result.product_summary?.primary_use || null,
        expiry_date: expiryDate,
        notes: indications,
        image_url: preview,
        quantity: 1,
      });

      if (error) throw error;

      toast({
        title: l.success,
        description: l.successDesc,
      });

      setPreview(null);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: l.error,
        description: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setPreview(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-primary" />
            {l.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!preview ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={cn(
                "relative rounded-2xl border-2 border-dashed p-6 transition-all duration-300",
                isDragging
                  ? "border-primary bg-primary/5 scale-[1.02]"
                  : "border-border hover:border-primary/50 hover:bg-accent/30"
              )}
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent">
                  <ImageIcon className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {l.uploadTitle}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {l.dragHint}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="hidden"
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleInputChange}
                  className="hidden"
                />

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 sm:flex-none"
                >
                  <Upload className="h-4 w-4" />
                  <span>{l.uploadBtn}</span>
                </Button>

                <Button
                  variant="hero"
                  size="sm"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex-1 sm:flex-none"
                >
                  <Camera className="h-4 w-4" />
                  <span>{l.cameraBtn}</span>
                </Button>
              </div>

              <Alert className="mt-4 border-primary/30 bg-primary/5">
                <Lightbulb className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary font-semibold text-sm">{l.photoTip}</AlertTitle>
                <AlertDescription className="text-muted-foreground text-xs">
                  {l.photoTipText}
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-xl shadow-card">
                <img
                  src={preview}
                  alt="Medicine preview"
                  className="h-48 w-full object-cover"
                />
                <button
                  onClick={clearPreview}
                  disabled={isLoading}
                  className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm shadow-lg transition-transform hover:scale-110 disabled:opacity-50"
                >
                  <X className="h-4 w-4 text-foreground" />
                </button>
              </div>

              <Button
                variant="hero"
                onClick={handleAnalyzeAndAdd}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>{l.analyzing}</span>
                  </>
                ) : (
                  <>
                    <Pill className="h-5 w-5" />
                    <span>{l.analyze}</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}