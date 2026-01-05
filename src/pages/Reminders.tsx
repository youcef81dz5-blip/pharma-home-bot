import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, BellRing, Plus, Trash2, Clock, Pill, Volume2, Music, Play, Pencil, ArrowRight, ArrowLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeLanguageToggle } from "@/components/ThemeLanguageToggle";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AddReminderDialog } from "@/components/AddReminderDialog";
import { EditReminderDialog } from "@/components/EditReminderDialog";

interface Reminder {
  id: string;
  medicine_name: string;
  reminder_time: string;
  days_of_week: number[];
  dosage: string | null;
  notes: string | null;
  is_active: boolean;
}

type Tone = "double" | "classic" | "soft" | "alarm" | "siren";

const STORAGE_KEYS = {
  soundEnabled: "reminders:soundEnabled",
  tone: "reminders:tone",
} as const;

const translations = {
  ar: {
    title: "تذكيرات الأدوية",
    pageSubtitle: "إدارة تذكيرات أدويتك",
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
    alarmSettings: "إعدادات المنبه",
    sound: "الصوت",
    tone: "النغمة",
    testAlarm: "اختبار",
    edit: "تعديل",
    toneAlarm: "قوي طويل",
    toneSiren: "صافرة",
    toneClassic: "كلاسيكي",
    toneDouble: "مزدوج",
    toneSoft: "هادئ",
    soundBlockedHint: "قد يمنع المتصفح الصوت حتى تضغط (اختبار) مرة واحدة.",
    backToHome: "العودة للرئيسية",
    logout: "تسجيل الخروج",
    loginRequired: "يجب تسجيل الدخول أولاً",
  },
  en: {
    title: "Medication Reminders",
    pageSubtitle: "Manage your medication reminders",
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
    alarmSettings: "Alarm settings",
    sound: "Sound",
    tone: "Tone",
    testAlarm: "Test",
    edit: "Edit",
    toneAlarm: "Loud (Long)",
    toneSiren: "Siren",
    toneClassic: "Classic",
    toneDouble: "Double",
    toneSoft: "Soft",
    soundBlockedHint: "Browsers may block sound until you press (Test) once.",
    backToHome: "Back to Home",
    logout: "Logout",
    loginRequired: "Please login first",
  },
  fr: {
    title: "Rappels de Médicaments",
    pageSubtitle: "Gérer vos rappels de médicaments",
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
    alarmSettings: "Paramètres d'alarme",
    sound: "Son",
    tone: "Tonalité",
    testAlarm: "Tester",
    edit: "Modifier",
    toneAlarm: "Fort (Long)",
    toneSiren: "Sirène",
    toneClassic: "Classique",
    toneDouble: "Double",
    toneSoft: "Doux",
    soundBlockedHint: "Les navigateurs peuvent bloquer le son jusqu'à un clic sur (Tester).",
    backToHome: "Retour à l'Accueil",
    logout: "Déconnexion",
    loginRequired: "Veuillez d'abord vous connecter",
  },
};

function readBool(key: string, defaultValue: boolean) {
  try {
    const v = localStorage.getItem(key);
    if (v === null) return defaultValue;
    return v === "true";
  } catch {
    return defaultValue;
  }
}

function readTone(key: string, defaultValue: Tone): Tone {
  try {
    const v = localStorage.getItem(key) as Tone | null;
    if (v === "classic" || v === "double" || v === "soft" || v === "alarm" || v === "siren") return v;
    return defaultValue;
  } catch {
    return defaultValue;
  }
}

export default function Reminders() {
  const { language, dir } = useLanguage();
  const navigate = useNavigate();
  const t = translations[language];
  const ArrowIcon = dir === "rtl" ? ArrowRight : ArrowLeft;

  const [user, setUser] = useState<any>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() =>
    readBool(STORAGE_KEYS.soundEnabled, true)
  );
  const [tone, setTone] = useState<Tone>(() => readTone(STORAGE_KEYS.tone, "double"));

  const lastFiredRef = useRef<Record<string, string>>({});
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Check auth
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error(t.loginRequired);
        navigate("/auth");
        return;
      }
      setUser(session.user);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, t.loginRequired]);

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
    if (user) {
      fetchReminders();
    }
  }, [user, fetchReminders]);

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const getAudioContext = useCallback(async () => {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return null;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new Ctx();
    }

    if (audioCtxRef.current.state === "suspended") {
      try {
        await audioCtxRef.current.resume();
      } catch {
        // ignore
      }
    }

    return audioCtxRef.current;
  }, []);

  useEffect(() => {
    const unlock = () => {
      void getAudioContext();
    };

    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("touchstart", unlock, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("touchstart", unlock);
    };
  }, [getAudioContext]);

  const playTone = useCallback(
    async (selectedTone: Tone) => {
      const ctx = await getAudioContext();
      if (!ctx) return false;
      if (ctx.state !== "running") return false;

      const now = ctx.currentTime;

      const beep = (
        freq: number,
        startOffset: number,
        duration: number,
        gain: number,
        type: OscillatorType = "sine"
      ) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now + startOffset);

        g.gain.setValueAtTime(0.0001, now + startOffset);
        g.gain.exponentialRampToValueAtTime(gain, now + startOffset + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, now + startOffset + duration);

        osc.connect(g);
        g.connect(ctx.destination);

        osc.start(now + startOffset);
        osc.stop(now + startOffset + duration + 0.02);

        osc.onended = () => {
          try {
            osc.disconnect();
            g.disconnect();
          } catch {
            // ignore
          }
        };
      };

      if (selectedTone === "alarm") {
        const step = 0.7;
        const repeats = 14;
        for (let i = 0; i < repeats; i++) {
          const t0 = i * step;
          beep(880, t0, 0.55, 0.38, "square");
          beep(988, t0 + 0.28, 0.22, 0.22, "square");
        }
        return true;
      }

      if (selectedTone === "siren") {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();

        osc.type = "sawtooth";
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(0.26, now + 0.05);

        const duration = 8;
        const cycle = 0.8;
        const cycles = Math.floor(duration / cycle);

        for (let i = 0; i < cycles; i++) {
          const start = now + i * cycle;
          osc.frequency.setValueAtTime(520, start);
          osc.frequency.linearRampToValueAtTime(1200, start + cycle / 2);
          osc.frequency.linearRampToValueAtTime(520, start + cycle);
        }

        osc.connect(g);
        g.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + duration);

        osc.onended = () => {
          try {
            osc.disconnect();
            g.disconnect();
          } catch {
            // ignore
          }
        };

        return true;
      }

      if (selectedTone === "classic") {
        beep(880, 0, 0.55, 0.22);
        return true;
      }

      if (selectedTone === "soft") {
        beep(523.25, 0, 0.75, 0.16);
        return true;
      }

      beep(880, 0, 0.45, 0.22);
      beep(1046.5, 0.22, 0.45, 0.22);
      return true;
    },
    [getAudioContext]
  );

  const showNotification = useCallback(
    async (reminder: Reminder) => {
      toast.info(`💊 ${reminder.medicine_name}`, {
        description:
          reminder.dosage || (language === "ar" ? "حان وقت الدواء" : "Time to take your medicine"),
        duration: 10000,
      });

      if (soundEnabled) {
        const played = await playTone(tone);
        if (!played) {
          toast(t.soundBlockedHint, { duration: 6000 });
        }
      }

      if ("Notification" in window && Notification.permission === "granted") {
        const notification = new Notification(`💊 ${reminder.medicine_name}`, {
          body:
            reminder.dosage || (language === "ar" ? "حان وقت الدواء" : "Time to take your medicine"),
          icon: "/favicon.ico",
          tag: reminder.id,
          requireInteraction: true,
        });

        setTimeout(() => notification.close(), 10000);
      }
    },
    [language, playTone, soundEnabled, t.soundBlockedHint, tone]
  );

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);
      const currentDay = now.getDay();
      const minuteKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${currentTime}`;

      reminders.forEach((reminder) => {
        if (!reminder.is_active) return;
        if (!reminder.days_of_week.includes(currentDay)) return;
        if (reminder.reminder_time.slice(0, 5) !== currentTime) return;

        if (lastFiredRef.current[reminder.id] === minuteKey) return;
        lastFiredRef.current[reminder.id] = minuteKey;

        void showNotification(reminder);
      });
    };

    checkReminders();
    const interval = setInterval(checkReminders, 10_000);

    const onVisibility = () => {
      if (document.visibilityState === "visible") checkReminders();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reminders, showNotification]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const openEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setEditDialogOpen(true);
  };

  const updateReminder = async (
    id: string,
    updates: Pick<Reminder, "reminder_time" | "days_of_week" | "dosage">
  ) => {
    try {
      const { error } = await supabase.from("medication_reminders").update(updates).eq("id", id);
      if (error) throw error;

      setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
      toast.success(t.updateSuccess);
    } catch (error) {
      console.error("Error updating reminder:", error);
      toast.error(t.updateError);
      throw error;
    }
  };

  const toggleReminder = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("medication_reminders")
        .update({ is_active: isActive })
        .eq("id", id);

      if (error) throw error;

      setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, is_active: isActive } : r)));
      toast.success(t.updateSuccess);
    } catch (error) {
      console.error("Error updating reminder:", error);
      toast.error(t.updateError);
    }
  };

  const deleteReminder = async (id: string) => {
    try {
      const { error } = await supabase.from("medication_reminders").delete().eq("id", id);

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
    const period = h >= 12 ? (language === "ar" ? "م" : "PM") : language === "ar" ? "ص" : "AM";
    const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${displayHour}:${minutes} ${period}`;
  };

  const saveSoundEnabled = (enabled: boolean) => {
    setSoundEnabled(enabled);
    try {
      localStorage.setItem(STORAGE_KEYS.soundEnabled, String(enabled));
    } catch {
      // ignore
    }
  };

  const saveTone = (newTone: Tone) => {
    setTone(newTone);
    try {
      localStorage.setItem(STORAGE_KEYS.tone, newTone);
    } catch {
      // ignore
    }
  };

  const handleTestAlarm = async () => {
    const played = await playTone(tone);
    if (!played) {
      toast.error(language === "ar" ? "تعذر تشغيل الصوت (تحقق من إعدادات المتصفح)" : "Couldn't play sound");
      return;
    }

    toast.success(language === "ar" ? "تم تشغيل اختبار المنبه" : "Alarm test played");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border/50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-soft">
              <BellRing className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground">{t.title}</span>
              <span className="text-xs text-muted-foreground">{t.pageSubtitle}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeLanguageToggle />
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">{t.logout}</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container pb-20 pt-6">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowIcon className="h-4 w-4" />
          {t.backToHome}
        </Button>

        {/* Main Content */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{t.title}</h1>
                <p className="text-sm text-muted-foreground">{t.pageSubtitle}</p>
              </div>
            </div>
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              {t.addReminder}
            </Button>
          </div>

          {/* Alarm settings */}
          <div className="mb-6 rounded-xl border border-border/50 bg-muted/20 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-semibold text-foreground">{t.alarmSettings}</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center justify-between sm:justify-start gap-3">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{t.sound}</span>
                </div>
                <Switch checked={soundEnabled} onCheckedChange={saveSoundEnabled} />
              </div>

              <div className="flex items-center gap-2">
                <Music className="h-4 w-4 text-muted-foreground" />
                <Select value={tone} onValueChange={(v) => saveTone(v as Tone)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder={t.tone} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alarm">{t.toneAlarm}</SelectItem>
                    <SelectItem value="siren">{t.toneSiren}</SelectItem>
                    <SelectItem value="double">{t.toneDouble}</SelectItem>
                    <SelectItem value="classic">{t.toneClassic}</SelectItem>
                    <SelectItem value="soft">{t.toneSoft}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" size="sm" onClick={handleTestAlarm} className="gap-2">
                <Play className="h-4 w-4" />
                {t.testAlarm}
              </Button>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">{t.soundBlockedHint}</p>
          </div>

          {reminders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Bell className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">{t.noReminders}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    reminder.is_active ? "bg-primary/5 border-primary/20" : "bg-muted/50 border-muted opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Pill className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{reminder.medicine_name}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(reminder.reminder_time)}
                        </span>
                        <span>•</span>
                        <span>{formatDays(reminder.days_of_week)}</span>
                      </div>
                      {reminder.dosage && <p className="text-xs text-primary mt-1">{reminder.dosage}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(reminder)}
                      aria-label={t.edit}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

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
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-6">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            {language === "ar" ? "صيدلي البيت" : "PHARMA HOME"} © {new Date().getFullYear()}
          </p>
        </div>
      </footer>

      <AddReminderDialog open={dialogOpen} onOpenChange={setDialogOpen} onSuccess={fetchReminders} />
      <EditReminderDialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) setEditingReminder(null);
        }}
        reminder={editingReminder}
        onSave={async (updates) => {
          if (!editingReminder) return;
          await updateReminder(editingReminder.id, updates);
        }}
      />
    </div>
  );
}
