import { useState, useRef, useCallback } from "react";
import { Camera, Upload, Image as ImageIcon, X, Loader2, Pill, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ImageUploaderProps {
  onImageSelect: (base64: string) => void;
  isLoading: boolean;
}

const labels = {
  ar: {
    uploadTitle: "ارفع صورة الدواء",
    dragHint: "اسحب الصورة هنا أو اختر من الخيارات أدناه",
    uploadBtn: "رفع صورة",
    cameraBtn: "التقاط بالكاميرا",
    analyzing: "جاري التحليل...",
    analyze: "تحليل المكونات",
    imageAlt: "صورة الدواء",
    photoTip: "⚠️ نصيحة مهمة للتصوير",
    photoTipText: "لقراءة دقيقة خاصة لتاريخ الصلاحية: أوقف تأثير Vignette (الحواف الداكنة) من إعدادات الكاميرا. استخدم إضاءة جيدة ومتساوية، وضع الدواء على خلفية فاتحة وبيضاء. تأكد أن تاريخ الصلاحية والمكونات واضحة ومقروءة في الصورة.",
  },
  en: {
    uploadTitle: "Upload Medicine Image",
    dragHint: "Drag image here or choose from options below",
    uploadBtn: "Upload Image",
    cameraBtn: "Take Photo",
    analyzing: "Analyzing...",
    analyze: "Analyze Ingredients",
    imageAlt: "Medicine image",
    photoTip: "⚠️ Important Photo Tips",
    photoTipText: "For accurate reading, especially expiry dates: Disable Vignette effect (dark edges) in camera settings. Use good, even lighting and place medicine on a light/white background. Ensure expiry date and ingredients are clear and readable in the photo.",
  },
  fr: {
    uploadTitle: "Télécharger l'Image du Médicament",
    dragHint: "Glissez l'image ici ou choisissez parmi les options ci-dessous",
    uploadBtn: "Télécharger",
    cameraBtn: "Prendre une Photo",
    analyzing: "Analyse en cours...",
    analyze: "Analyser les Ingrédients",
    imageAlt: "Image du médicament",
    photoTip: "⚠️ Conseils Photo Importants",
    photoTipText: "Pour une lecture précise, surtout des dates de péremption: Désactivez l'effet Vignette (bords sombres) dans les paramètres de l'appareil photo. Utilisez un bon éclairage uniforme et placez le médicament sur un fond clair/blanc. Assurez-vous que la date de péremption et les ingrédients sont clairs et lisibles.",
  },
  es: {
    uploadTitle: "Subir Imagen del Medicamento",
    dragHint: "Arrastra la imagen aquí o elige de las opciones abajo",
    uploadBtn: "Subir Imagen",
    cameraBtn: "Tomar Foto",
    analyzing: "Analizando...",
    analyze: "Analizar Ingredientes",
    imageAlt: "Imagen del medicamento",
    photoTip: "⚠️ Consejos Importantes para la Foto",
    photoTipText: "Para una lectura precisa, especialmente fechas de vencimiento: Desactiva el efecto Viñeta (bordes oscuros) en la configuración de la cámara. Usa buena iluminación uniforme y coloca el medicamento sobre un fondo claro/blanco. Asegúrate de que la fecha de vencimiento y los ingredientes sean claros y legibles en la foto.",
  },
};

export function ImageUploader({ onImageSelect, isLoading }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { language } = useLanguage();
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

  const handleAnalyze = useCallback(() => {
    if (preview) {
      onImageSelect(preview);
    }
  }, [preview, onImageSelect]);

  return (
    <div className="space-y-4">
      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "relative rounded-2xl border-2 border-dashed p-8 transition-all duration-300",
            isDragging
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-border hover:border-primary/50 hover:bg-accent/30"
          )}
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent float-animation">
              <ImageIcon className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {l.uploadTitle}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {l.dragHint}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
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
              size="lg"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 sm:flex-none"
            >
              <Upload className="h-5 w-5" />
              <span>{l.uploadBtn}</span>
            </Button>

            <Button
              variant="hero"
              size="lg"
              onClick={() => cameraInputRef.current?.click()}
              className="flex-1 sm:flex-none"
            >
              <Camera className="h-5 w-5" />
              <span>{l.cameraBtn}</span>
            </Button>
          </div>

          <Alert className="mt-4 border-primary/30 bg-primary/5">
            <Lightbulb className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary font-semibold">{l.photoTip}</AlertTitle>
            <AlertDescription className="text-muted-foreground text-sm">
              {l.photoTipText}
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <div className="fade-in-up space-y-4">
          <div className="relative overflow-hidden rounded-2xl shadow-card">
            <img
              src={preview}
              alt={l.imageAlt}
              className="h-64 w-full object-cover sm:h-80"
            />
            <button
              onClick={clearPreview}
              className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm shadow-lg transition-transform hover:scale-110"
            >
              <X className="h-5 w-5 text-foreground" />
            </button>
          </div>

          <Button
            variant="hero"
            size="xl"
            onClick={handleAnalyze}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>{l.analyzing}</span>
              </>
            ) : (
              <>
                <Pill className="h-6 w-6" />
                <span>{l.analyze}</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
