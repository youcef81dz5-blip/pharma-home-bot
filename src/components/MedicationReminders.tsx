import { useState, useEffect, useCallback } from "react";
import { Bell, BellRing, Plus, Trash2, Clock, Pill, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AddReminderDialog } from "./AddReminderDialog";

interface Reminder {
  id: string;
  medicine_name: string;
  reminder_time: string;
  days_of_week: number[];
  dosage: string | null;
  notes: string | null;
  is_active: boolean;
}

const translations = {
  ar: {
    title: "تذكيرات الأدوية",
    noReminders: "لا توجد تذكيرات حتى الآن",
    addReminder: "إضافة تذكير",
    delete: "حذف",
    active: "مفعل",
    inactive: "متوقف",
    deleteSuccess: "تم حذف التذكير",
    deleteError: "خطأ في حذف التذكير",
    updateSuccess: "تم تحديث التذكير",
    updateError: "خطأ في تحديث التذكير",
    notificationPermission: "يرجى السماح بالإشعارات للتذكيرات",
    days: ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
    everyDay: "كل يوم",
  },
  en: {
    title: "Medication Reminders",
    noReminders: "No reminders yet",
    addReminder: "Add Reminder",
    delete: "Delete",
    active: "Active",
    inactive: "Inactive",
    deleteSuccess: "Reminder deleted",
    deleteError: "Error deleting reminder",
    updateSuccess: "Reminder updated",
    updateError: "Error updating reminder",
    notificationPermission: "Please allow notifications for reminders",
    days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    everyDay: "Every day",
  },
  fr: {
    title: "Rappels de Médicaments",
    noReminders: "Aucun rappel",
    addReminder: "Ajouter un rappel",
    delete: "Supprimer",
    active: "Actif",
    inactive: "Inactif",
    deleteSuccess: "Rappel supprimé",
    deleteError: "Erreur de suppression",
    updateSuccess: "Rappel mis à jour",
    updateError: "Erreur de mise à jour",
    notificationPermission: "Veuillez autoriser les notifications",
    days: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
    everyDay: "Tous les jours",
  },
};

export function MedicationReminders() {
  const { language } = useLanguage();
  const t = translations[language];
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchReminders = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("medication_reminders")
        .select("*")
        .eq("user_id", user.id)
        .order("reminder_time");

      if (error) throw error;
      setReminders(data || []);
    } catch (error) {
      console.error("Error fetching reminders:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Check reminders every minute and on mount
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);
      const currentDay = now.getDay();

      reminders.forEach((reminder) => {
        if (
          reminder.is_active &&
          reminder.reminder_time.slice(0, 5) === currentTime &&
          reminder.days_of_week.includes(currentDay)
        ) {
          showNotification(reminder);
        }
      });
    };

    // Check immediately on mount
    checkReminders();
    
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [reminders, language]);

  const playNotificationSound = () => {
    try {
      // Create audio context for notification sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Pleasant notification tone
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5
      oscillator.type = "sine";
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      
      // Play second beep
      setTimeout(() => {
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        osc2.frequency.setValueAtTime(1046.5, audioContext.currentTime); // C6
        osc2.type = "sine";
        gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        osc2.start();
        osc2.stop(audioContext.currentTime + 0.5);
      }, 200);
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const showNotification = (reminder: Reminder) => {
    // Play sound first
    playNotificationSound();
    
    // Show toast notification (always works)
    toast.info(`💊 ${reminder.medicine_name}`, {
      description: reminder.dosage || (language === "ar" ? "حان وقت الدواء" : "Time to take your medicine"),
      duration: 10000,
    });

    // Also show browser notification if permission granted
    if ("Notification" in window && Notification.permission === "granted") {
      const notification = new Notification(`💊 ${reminder.medicine_name}`, {
        body: reminder.dosage || (language === "ar" ? "حان وقت الدواء" : "Time to take your medicine"),
        icon: "/favicon.ico",
        tag: reminder.id,
        requireInteraction: true,
      });
      
      // Close after 10 seconds
      setTimeout(() => notification.close(), 10000);
    }
  };

  const toggleReminder = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("medication_reminders")
        .update({ is_active: isActive })
        .eq("id", id);

      if (error) throw error;

      setReminders((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_active: isActive } : r))
      );
      toast.success(t.updateSuccess);
    } catch (error) {
      console.error("Error updating reminder:", error);
      toast.error(t.updateError);
    }
  };

  const deleteReminder = async (id: string) => {
    try {
      const { error } = await supabase
        .from("medication_reminders")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setReminders((prev) => prev.filter((r) => r.id !== id));
      toast.success(t.deleteSuccess);
    } catch (error) {
      console.error("Error deleting reminder:", error);
      toast.error(t.deleteError);
    }
  };

  const formatDays = (days: number[]) => {
    if (days.length === 7) return t.everyDay;
    return days.map((d) => t.days[d]).join(", ");
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours);
    const period = h >= 12 ? (language === "ar" ? "م" : "PM") : (language === "ar" ? "ص" : "AM");
    const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${displayHour}:${minutes} ${period}`;
  };

  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-20 bg-muted rounded"></div>
          <div className="h-20 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <BellRing className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">{t.title}</h2>
        </div>
        <Button onClick={() => setDialogOpen(true)} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          {t.addReminder}
        </Button>
      </div>

      {reminders.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>{t.noReminders}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                reminder.is_active
                  ? "bg-primary/5 border-primary/20"
                  : "bg-muted/50 border-muted opacity-60"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Pill className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {reminder.medicine_name}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(reminder.reminder_time)}
                    </span>
                    <span>•</span>
                    <span>{formatDays(reminder.days_of_week)}</span>
                  </div>
                  {reminder.dosage && (
                    <p className="text-xs text-primary mt-1">{reminder.dosage}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  checked={reminder.is_active}
                  onCheckedChange={(checked) => toggleReminder(reminder.id, checked)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteReminder(reminder.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddReminderDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={fetchReminders}
      />
    </div>
  );
}