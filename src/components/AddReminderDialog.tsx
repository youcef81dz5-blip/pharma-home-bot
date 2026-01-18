import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Medicine {
  id: string;
  name_ar: string;
}

interface AddReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const translations = {
  ar: {
    title: "إضافة تذكير جديد",
    selectMedicine: "اختر الدواء",
    orEnterName: "أو أدخل اسم الدواء",
    medicineName: "اسم الدواء",
    time: "وقت التذكير",
    dosage: "الجرعة (اختياري)",
    dosagePlaceholder: "مثال: قرص واحد",
    selectDays: "أيام التذكير",
    days: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
    add: "إضافة التذكير",
    adding: "جاري الإضافة...",
    success: "تم إضافة التذكير بنجاح",
    error: "خطأ في إضافة التذكير",
    loginRequired: "يجب تسجيل الدخول أولاً",
    selectAll: "تحديد الكل",
    fromInventory: "من المخزون",
    manual: "إدخال يدوي",
  },
  en: {
    title: "Add New Reminder",
    selectMedicine: "Select Medicine",
    orEnterName: "Or enter medicine name",
    medicineName: "Medicine Name",
    time: "Reminder Time",
    dosage: "Dosage (optional)",
    dosagePlaceholder: "e.g., One tablet",
    selectDays: "Reminder Days",
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    add: "Add Reminder",
    adding: "Adding...",
    success: "Reminder added successfully",
    error: "Error adding reminder",
    loginRequired: "Please login first",
    selectAll: "Select All",
    fromInventory: "From Inventory",
    manual: "Manual Entry",
  },
  fr: {
    title: "Ajouter un rappel",
    selectMedicine: "Sélectionner le médicament",
    orEnterName: "Ou entrez le nom",
    medicineName: "Nom du médicament",
    time: "Heure du rappel",
    dosage: "Dosage (optionnel)",
    dosagePlaceholder: "ex: Un comprimé",
    selectDays: "Jours de rappel",
    days: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
    add: "Ajouter le rappel",
    adding: "Ajout en cours...",
    success: "Rappel ajouté avec succès",
    error: "Erreur lors de l'ajout",
    loginRequired: "Veuillez vous connecter",
    selectAll: "Tout sélectionner",
    fromInventory: "De l'inventaire",
    manual: "Saisie manuelle",
  },
  es: {
    title: "Agregar Nuevo Recordatorio",
    selectMedicine: "Seleccionar Medicamento",
    orEnterName: "O ingresa el nombre",
    medicineName: "Nombre del Medicamento",
    time: "Hora del Recordatorio",
    dosage: "Dosis (opcional)",
    dosagePlaceholder: "ej: Una tableta",
    selectDays: "Días del Recordatorio",
    days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    add: "Agregar Recordatorio",
    adding: "Agregando...",
    success: "Recordatorio agregado exitosamente",
    error: "Error al agregar recordatorio",
    loginRequired: "Por favor inicia sesión primero",
    selectAll: "Seleccionar Todo",
    fromInventory: "Del Inventario",
    manual: "Entrada Manual",
  },
};

export function AddReminderDialog({ open, onOpenChange, onSuccess }: AddReminderDialogProps) {
  const { language } = useLanguage();
  const t = translations[language];

  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedMedicineId, setSelectedMedicineId] = useState<string>("");
  const [medicineName, setMedicineName] = useState("");
  const [reminderTime, setReminderTime] = useState("08:00");
  const [dosage, setDosage] = useState("");
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputMode, setInputMode] = useState<"inventory" | "manual">("inventory");

  useEffect(() => {
    if (open) {
      fetchMedicines();
    }
  }, [open]);

  const fetchMedicines = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("medicine_inventory")
        .select("id, name_ar")
        .eq("user_id", user.id);

      if (error) throw error;
      setMedicines(data || []);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const selectAllDays = () => {
    if (selectedDays.length === 7) {
      setSelectedDays([]);
    } else {
      setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
    }
  };

  const handleSubmit = async () => {
    const finalName = inputMode === "inventory" 
      ? medicines.find(m => m.id === selectedMedicineId)?.name_ar 
      : medicineName;

    if (!finalName || !reminderTime || selectedDays.length === 0) {
      toast.error(language === "ar" ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error(t.loginRequired);
        return;
      }

      const { error } = await supabase.from("medication_reminders").insert({
        user_id: user.id,
        medicine_id: inputMode === "inventory" ? selectedMedicineId : null,
        medicine_name: finalName,
        reminder_time: reminderTime,
        days_of_week: selectedDays,
        dosage: dosage || null,
      });

      if (error) throw error;

      toast.success(t.success);
      onSuccess();
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding reminder:", error);
      toast.error(t.error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedMedicineId("");
    setMedicineName("");
    setReminderTime("08:00");
    setDosage("");
    setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
    setInputMode("inventory");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{t.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Input Mode Toggle */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={inputMode === "inventory" ? "default" : "outline"}
              size="sm"
              onClick={() => setInputMode("inventory")}
              className="flex-1"
            >
              {t.fromInventory}
            </Button>
            <Button
              type="button"
              variant={inputMode === "manual" ? "default" : "outline"}
              size="sm"
              onClick={() => setInputMode("manual")}
              className="flex-1"
            >
              {t.manual}
            </Button>
          </div>

          {/* Medicine Selection */}
          {inputMode === "inventory" ? (
            <div className="space-y-2">
              <Label>{t.selectMedicine}</Label>
              <Select value={selectedMedicineId} onValueChange={setSelectedMedicineId}>
                <SelectTrigger>
                  <SelectValue placeholder={t.selectMedicine} />
                </SelectTrigger>
                <SelectContent>
                  {medicines.map((medicine) => (
                    <SelectItem key={medicine.id} value={medicine.id}>
                      {medicine.name_ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>{t.medicineName}</Label>
              <Input
                value={medicineName}
                onChange={(e) => setMedicineName(e.target.value)}
                placeholder={t.medicineName}
              />
            </div>
          )}

          {/* Time */}
          <div className="space-y-2">
            <Label>{t.time}</Label>
            <Input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="text-lg"
            />
          </div>

          {/* Dosage */}
          <div className="space-y-2">
            <Label>{t.dosage}</Label>
            <Input
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder={t.dosagePlaceholder}
            />
          </div>

          {/* Days Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>{t.selectDays}</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={selectAllDays}
                className="text-xs"
              >
                {t.selectAll}
              </Button>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {t.days.map((day, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => toggleDay(index)}
                  className={`p-2 text-xs rounded-lg transition-all ${
                    selectedDays.includes(index)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {day.slice(0, 2)}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full gap-2"
            size="lg"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? t.adding : t.add}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}