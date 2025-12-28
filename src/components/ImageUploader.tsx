import { useState, useRef, useCallback } from "react";
import { Camera, Upload, Image as ImageIcon, X, Loader2, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onImageSelect: (base64: string) => void;
  isLoading: boolean;
}

export function ImageUploader({ onImageSelect, isLoading }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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
                ارفع صورة الدواء
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                اسحب الصورة هنا أو اختر من الخيارات أدناه
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
              <span>رفع صورة</span>
            </Button>

            <Button
              variant="hero"
              size="lg"
              onClick={() => cameraInputRef.current?.click()}
              className="flex-1 sm:flex-none"
            >
              <Camera className="h-5 w-5" />
              <span>التقاط بالكاميرا</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="fade-in-up space-y-4">
          <div className="relative overflow-hidden rounded-2xl shadow-card">
            <img
              src={preview}
              alt="صورة الدواء"
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
                <span>جاري التحليل...</span>
              </>
            ) : (
              <>
                <Pill className="h-6 w-6" />
                <span>تحليل المكونات</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
