import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

type ReminderLike = {
  id: string;
  medicine_name: string;
  reminder_time: string;
  days_of_week: number[];
  dosage: string | null;
};

type ReminderUpdates = {
  reminder_time: string;
  days_of_week: number[];
  dosage: string | null;
};

interface EditReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reminder: ReminderLike | null;
  onSave: (updates: ReminderUpdates) => Promise<void>;
}

const translations = {
  ar: {
    title: "تعديل التذكير",
    medicine: "الدواء",
    time: "وقت التذكير",
    dosage: "الجرعة (اختياري)",
    dosagePlaceholder: "مثال: قرص واحد",
    selectDays: "أيام التذكير",
    days: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
    selectAll: "تحديد الكل",
    save: "حفظ التغييرات",
    saving: "جاري الحفظ...",
    cancel: "إلغاء",
    requiredError: "يرجى ملء الحقول المطلوبة",
  },
  en: {
    title: "Edit Reminder",
    medicine: "Medicine",
    time: "Reminder Time",
    dosage: "Dosage (optional)",
    dosagePlaceholder: "e.g., One tablet",
    selectDays: "Reminder Days",
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    selectAll: "Select All",
    save: "Save changes",
    saving: "Saving...",
    cancel: "Cancel",
    requiredError: "Please fill required fields",
  },
  fr: {
    title: "Modifier le rappel",
    medicine: "Médicament",
    time: "Heure du rappel",
    dosage: "Dosage (optionnel)",
    dosagePlaceholder: "ex: Un comprimé",
    selectDays: "Jours de rappel",
    days: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
    selectAll: "Tout sélectionner",
    save: "Enregistrer",
    saving: "Enregistrement...",
    cancel: "Annuler",
    requiredError: "Veuillez remplir les champs requis",
  },
};

export function EditReminderDialog({ open, onOpenChange, reminder, onSave }: EditReminderDialogProps) {
  const { language } = useLanguage();
  const t = translations[language];

  const [reminderTime, setReminderTime] = useState("08:00");
  const [dosage, setDosage] = useState("");
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open || !reminder) return;
    setReminderTime(reminder.reminder_time.slice(0, 5));
    setDosage(reminder.dosage ?? "");
    setSelectedDays(reminder.days_of_week ?? [0, 1, 2, 3, 4, 5, 6]);
  }, [open, reminder]);

  const toggleDay = (day: number) => {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()));
  };

  const selectAllDays = () => {
    setSelectedDays((prev) => (prev.length === 7 ? [] : [0, 1, 2, 3, 4, 5, 6]));
  };

  const handleSave = async () => {
    if (!reminder) return;
    if (!reminderTime || selectedDays.length === 0) {
      toast.error(t.requiredError);
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        reminder_time: reminderTime,
        days_of_week: selectedDays,
        dosage: dosage.trim() ? dosage.trim() : null,
      });
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{t.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label>{t.medicine}</Label>
            <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground">
              {reminder?.medicine_name ?? "—"}
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t.time}</Label>
            <Input type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} className="text-lg" />
          </div>

          <div className="space-y-2">
            <Label>{t.dosage}</Label>
            <Input value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder={t.dosagePlaceholder} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>{t.selectDays}</Label>
              <Button type="button" variant="ghost" size="sm" onClick={selectAllDays} className="text-xs">
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
                    selectedDays.includes(index) ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {day.slice(0, 2)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)} disabled={isSaving}>
              {t.cancel}
            </Button>
            <Button type="button" className="flex-1 gap-2" onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSaving ? t.saving : t.save}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
