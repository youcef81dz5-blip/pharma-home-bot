import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Bell, BellRing, Plus, Trash2, Clock, Pill, Volume2, Music, Play, Pencil, ArrowRight, ArrowLeft, LogOut, Power, PowerOff, AlarmClock, Sun, Moon } from "lucide-react";
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
    noReminders: "لا توجد تذكيرات",
    noRemindersSubtitle: "اضغط على الزر أدناه لإضافة تذكير جديد",
    addReminder: "إضافة تذكير جديد",
    addReminderShort: "إضافة",
    delete: "حذف",
    active: "مفعل",
    inactive: "متوقف",
    deleteSuccess: "تم حذف التذكير",
    deleteError: "خطأ في حذف التذكير",
    updateSuccess: "تم تحديث التذكير",
    updateError: "خطأ في تحديث التذكير",
    notificationPermission: "يرجى السماح بالإشعارات للتذكيرات",
    days: ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
    daysShort: ["أ", "ث", "ث", "أ", "خ", "ج", "س"],
    everyDay: "كل يوم",
    alarmSettings: "إعدادات المنبه",
    sound: "الصوت",
    tone: "النغمة",
    testAlarm: "اختبار الصوت",
    edit: "تعديل",
    toneAlarm: "قوي طويل",
    toneSiren: "صافرة",
    toneClassic: "كلاسيكي",
    toneDouble: "مزدوج",
    toneSoft: "هادئ",
    soundBlockedHint: "اضغط (اختبار الصوت) لتفعيل المنبه",
    backToHome: "العودة للرئيسية",
    logout: "خروج",
    loginRequired: "يجب تسجيل الدخول أولاً",
    on: "تشغيل",
    off: "إيقاف",
    tapToToggle: "اضغط للتفعيل/الإيقاف",
  },
  en: {
    title: "Medication Reminders",
    pageSubtitle: "Manage your medication reminders",
    noReminders: "No reminders",
    noRemindersSubtitle: "Tap the button below to add a new reminder",
    addReminder: "Add New Reminder",
    addReminderShort: "Add",
    delete: "Delete",
    active: "Active",
    inactive: "Inactive",
    deleteSuccess: "Reminder deleted",
    deleteError: "Error deleting reminder",
    updateSuccess: "Reminder updated",
    updateError: "Error updating reminder",
    notificationPermission: "Please allow notifications for reminders",
    days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    daysShort: ["S", "M", "T", "W", "T", "F", "S"],
    everyDay: "Every day",
    alarmSettings: "Alarm settings",
    sound: "Sound",
    tone: "Tone",
    testAlarm: "Test Sound",
    edit: "Edit",
    toneAlarm: "Loud (Long)",
    toneSiren: "Siren",
    toneClassic: "Classic",
    toneDouble: "Double",
    toneSoft: "Soft",
    soundBlockedHint: "Tap (Test Sound) to enable alarm",
    backToHome: "Back to Home",
    logout: "Logout",
    loginRequired: "Please login first",
    on: "ON",
    off: "OFF",
    tapToToggle: "Tap to toggle",
  },
  fr: {
    title: "Rappels de Médicaments",
    pageSubtitle: "Gérer vos rappels de médicaments",
    noReminders: "Aucun rappel",
    noRemindersSubtitle: "Appuyez sur le bouton ci-dessous pour ajouter un rappel",
    addReminder: "Ajouter un Rappel",
    addReminderShort: "Ajouter",
    delete: "Supprimer",
    active: "Actif",
    inactive: "Inactif",
    deleteSuccess: "Rappel supprimé",
    deleteError: "Erreur de suppression",
    updateSuccess: "Rappel mis à jour",
    updateError: "Erreur de mise à jour",
    notificationPermission: "Veuillez autoriser les notifications",
    days: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
    daysShort: ["D", "L", "M", "M", "J", "V", "S"],
    everyDay: "Tous les jours",
    alarmSettings: "Paramètres d'alarme",
    sound: "Son",
    tone: "Tonalité",
    testAlarm: "Tester le Son",
    edit: "Modifier",
    toneAlarm: "Fort (Long)",
    toneSiren: "Sirène",
    toneClassic: "Classique",
    toneDouble: "Double",
    toneSoft: "Doux",
    soundBlockedHint: "Appuyez sur (Tester le Son) pour activer l'alarme",
    backToHome: "Retour à l'Accueil",
    logout: "Déconnexion",
    loginRequired: "Veuillez d'abord vous connecter",
    on: "ON",
    off: "OFF",
    tapToToggle: "Appuyez pour basculer",
  },
  es: {
    title: "Recordatorios de Medicamentos",
    pageSubtitle: "Gestiona tus recordatorios de medicamentos",
    noReminders: "Sin recordatorios",
    noRemindersSubtitle: "Toca el botón de abajo para agregar un recordatorio",
    addReminder: "Agregar Recordatorio",
    addReminderShort: "Agregar",
    delete: "Eliminar",
    active: "Activo",
    inactive: "Inactivo",
    deleteSuccess: "Recordatorio eliminado",
    deleteError: "Error al eliminar recordatorio",
    updateSuccess: "Recordatorio actualizado",
    updateError: "Error al actualizar recordatorio",
    notificationPermission: "Por favor permite las notificaciones para los recordatorios",
    days: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
    daysShort: ["D", "L", "M", "M", "J", "V", "S"],
    everyDay: "Todos los días",
    alarmSettings: "Configuración de alarma",
    sound: "Sonido",
    tone: "Tono",
    testAlarm: "Probar Sonido",
    edit: "Editar",
    toneAlarm: "Fuerte (Largo)",
    toneSiren: "Sirena",
    toneClassic: "Clásico",
    toneDouble: "Doble",
    toneSoft: "Suave",
    soundBlockedHint: "Toca (Probar Sonido) para activar la alarma",
    backToHome: "Volver al Inicio",
    logout: "Cerrar Sesión",
    loginRequired: "Por favor inicia sesión primero",
    on: "ON",
    off: "OFF",
    tapToToggle: "Toca para activar/desactivar",
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
  const location = useLocation();
  const t = translations[language];
  const ArrowIcon = dir === "rtl" ? ArrowRight : ArrowLeft;
  const redirectPath = location.pathname + location.search;

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
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        toast.error(t.loginRequired);
        navigate(`/auth?redirect=${encodeURIComponent(redirectPath)}`, { replace: true });
        return;
      }
      setUser(session.user);
    };
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) {
        navigate(`/auth?redirect=${encodeURIComponent(redirectPath)}`, { replace: true });
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, redirectPath, t.loginRequired]);

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

  const getTimeIcon = (time: string) => {
    const h = parseInt(time.split(":")[0]);
    return h >= 6 && h < 18 ? Sun : Moon;
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
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-primary/20 animate-pulse"></div>
            <AlarmClock className="absolute inset-0 m-auto h-12 w-12 text-primary animate-bounce" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5" dir={dir}>
      {/* Header - Samsung Style */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border/50 shadow-sm">
        <div className="container flex h-20 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/30">
              <AlarmClock className="h-7 w-7 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground">{t.title}</span>
              <span className="text-sm text-muted-foreground">{t.pageSubtitle}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeLanguageToggle />
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleLogout} 
              className="gap-2 h-12 px-4 rounded-xl text-base font-medium"
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden sm:inline">{t.logout}</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container pb-32 pt-6 px-4">
        {/* Back Button - Large for elderly */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-6 h-14 text-lg gap-3 rounded-xl hover:bg-primary/10"
          size="lg"
        >
          <ArrowIcon className="h-6 w-6" />
          {t.backToHome}
        </Button>

        {/* Alarm Settings Card - Samsung Style */}
        <div className="mb-8 rounded-3xl bg-gradient-to-br from-card to-card/80 border border-border/50 p-6 shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Volume2 className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{t.alarmSettings}</h2>
              <p className="text-sm text-muted-foreground">{t.soundBlockedHint}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* Sound Toggle - Large Button */}
            <button
              onClick={() => saveSoundEnabled(!soundEnabled)}
              className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all duration-300 ${
                soundEnabled 
                  ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/20" 
                  : "bg-muted/50 border-muted-foreground/20 text-muted-foreground"
              }`}
            >
              <Volume2 className="h-10 w-10" />
              <span className="text-lg font-bold">{t.sound}</span>
              <span className={`text-sm font-medium px-4 py-1 rounded-full ${
                soundEnabled ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {soundEnabled ? t.on : t.off}
              </span>
            </button>

            {/* Tone Selector - Large */}
            <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-border bg-card">
              <Music className="h-10 w-10 text-primary" />
              <span className="text-lg font-bold text-foreground">{t.tone}</span>
              <Select value={tone} onValueChange={(v) => saveTone(v as Tone)}>
                <SelectTrigger className="w-full h-12 text-base rounded-xl">
                  <SelectValue placeholder={t.tone} />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="alarm" className="text-base py-3">{t.toneAlarm}</SelectItem>
                  <SelectItem value="siren" className="text-base py-3">{t.toneSiren}</SelectItem>
                  <SelectItem value="double" className="text-base py-3">{t.toneDouble}</SelectItem>
                  <SelectItem value="classic" className="text-base py-3">{t.toneClassic}</SelectItem>
                  <SelectItem value="soft" className="text-base py-3">{t.toneSoft}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Test Alarm - Large Button */}
            <button
              onClick={handleTestAlarm}
              className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-accent bg-accent/10 text-accent-foreground hover:bg-accent/20 transition-all duration-300 active:scale-95"
            >
              <Play className="h-10 w-10 text-primary" />
              <span className="text-lg font-bold">{t.testAlarm}</span>
              <span className="text-sm text-muted-foreground">{t.tapToToggle}</span>
            </button>
          </div>
        </div>

        {/* Reminders List - Samsung Alarm Style */}
        {reminders.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="relative inline-block mb-8">
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                <AlarmClock className="h-16 w-16 text-primary/50" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">{t.noReminders}</h3>
            <p className="text-lg text-muted-foreground mb-8">{t.noRemindersSubtitle}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reminders.map((reminder) => {
              const TimeIcon = getTimeIcon(reminder.reminder_time);
              return (
                <div
                  key={reminder.id}
                  className={`relative overflow-hidden rounded-3xl border-2 transition-all duration-300 ${
                    reminder.is_active 
                      ? "bg-gradient-to-r from-card to-primary/5 border-primary/30 shadow-lg shadow-primary/10" 
                      : "bg-muted/30 border-muted opacity-70"
                  }`}
                >
                  {/* Main Content - Tappable Area for Toggle */}
                  <button
                    onClick={() => toggleReminder(reminder.id, !reminder.is_active)}
                    className="w-full p-6 text-start focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 rounded-3xl"
                  >
                    <div className="flex items-center gap-6">
                      {/* Large Time Display - Samsung Style */}
                      <div className={`flex flex-col items-center justify-center min-w-[120px] ${
                        reminder.is_active ? "text-foreground" : "text-muted-foreground"
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          <TimeIcon className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-5xl font-light tracking-tight">
                          {formatTime(reminder.reminder_time).split(" ")[0]}
                        </span>
                        <span className="text-xl font-medium text-primary">
                          {formatTime(reminder.reminder_time).split(" ")[1]}
                        </span>
                      </div>

                      {/* Divider */}
                      <div className={`w-px h-24 ${reminder.is_active ? "bg-primary/30" : "bg-muted"}`}></div>

                      {/* Medicine Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                            reminder.is_active ? "bg-primary/20" : "bg-muted"
                          }`}>
                            <Pill className={`h-6 w-6 ${reminder.is_active ? "text-primary" : "text-muted-foreground"}`} />
                          </div>
                          <h3 className={`text-2xl font-bold truncate ${
                            reminder.is_active ? "text-foreground" : "text-muted-foreground"
                          }`}>
                            {reminder.medicine_name}
                          </h3>
                        </div>
                        
                        {/* Days Display */}
                        <div className="flex flex-wrap gap-2 mb-2">
                          {reminder.days_of_week.length === 7 ? (
                            <span className={`text-base font-medium px-3 py-1 rounded-full ${
                              reminder.is_active ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                            }`}>
                              {t.everyDay}
                            </span>
                          ) : (
                            t.daysShort.map((day, index) => (
                              <span
                                key={index}
                                className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-bold ${
                                  reminder.days_of_week.includes(index)
                                    ? reminder.is_active 
                                      ? "bg-primary text-primary-foreground" 
                                      : "bg-muted-foreground/50 text-background"
                                    : "bg-muted/50 text-muted-foreground"
                                }`}
                              >
                                {day}
                              </span>
                            ))
                          )}
                        </div>

                        {/* Dosage */}
                        {reminder.dosage && (
                          <p className={`text-base ${reminder.is_active ? "text-primary" : "text-muted-foreground"}`}>
                            {reminder.dosage}
                          </p>
                        )}
                      </div>

                      {/* Status Indicator - Large */}
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                          reminder.is_active 
                            ? "bg-primary shadow-lg shadow-primary/30" 
                            : "bg-muted-foreground/30"
                        }`}>
                          {reminder.is_active ? (
                            <Power className="h-8 w-8 text-primary-foreground" />
                          ) : (
                            <PowerOff className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        <span className={`text-sm font-bold ${
                          reminder.is_active ? "text-primary" : "text-muted-foreground"
                        }`}>
                          {reminder.is_active ? t.on : t.off}
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Action Buttons - Large and Clear */}
                  <div className="flex border-t border-border/50">
                    <button
                      onClick={() => openEdit(reminder)}
                      className="flex-1 flex items-center justify-center gap-3 py-4 text-primary hover:bg-primary/10 transition-colors"
                    >
                      <Pencil className="h-6 w-6" />
                      <span className="text-lg font-medium">{t.edit}</span>
                    </button>
                    <div className="w-px bg-border/50"></div>
                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="flex-1 flex items-center justify-center gap-3 py-4 text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="h-6 w-6" />
                      <span className="text-lg font-medium">{t.delete}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Add Button - Samsung FAB Style */}
      <div className="fixed bottom-8 inset-x-0 px-4 z-50">
        <Button 
          onClick={() => setDialogOpen(true)} 
          size="xl"
          className="w-full max-w-md mx-auto flex items-center justify-center gap-4 h-16 rounded-2xl shadow-xl shadow-primary/30 text-xl font-bold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
        >
          <Plus className="h-7 w-7" />
          {t.addReminder}
        </Button>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-6 mb-24">
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
