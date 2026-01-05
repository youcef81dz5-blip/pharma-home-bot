import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeLanguageToggle } from "@/components/ThemeLanguageToggle";
import { Pill, Mail, Lock } from "lucide-react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { t, dir } = useLanguage();

  const redirectTo = (() => {
    const params = new URLSearchParams(location.search);
    const r = params.get("redirect");
    return r && r.startsWith("/") ? r : "/inventory";
  })();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: t("loginSuccess"),
          description: t("welcomeBack"),
        });
        navigate(redirectTo);
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        if (error) throw error;
        toast({
          title: t("accountCreated"),
          description: t("welcomeBack"),
        });
        navigate(redirectTo);
      }
    } catch (error: any) {
      let message = t("error");
      if (error.message.includes("Invalid login credentials")) {
        message = t("error");
      } else if (error.message.includes("User already registered")) {
        message = t("error");
      } else if (error.message.includes("Password should be at least")) {
        message = t("error");
      }
      toast({
        variant: "destructive",
        title: t("error"),
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" dir={dir}>
      <div className="absolute top-4 right-4">
        <ThemeLanguageToggle />
      </div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-soft mx-auto mb-4">
            <Pill className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t("appName")}</h1>
          <p className="text-muted-foreground mt-2">
            {isLogin ? t("loginToAccess") : t("createAccount")}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-border/50">
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:right-3 ltr:left-3" />
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-10"
                  required
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:right-3 ltr:left-3" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-10"
                  required
                  minLength={6}
                  dir="ltr"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : isLogin ? (
                t("login")
              ) : (
                t("signup")
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:underline"
            >
              {isLogin ? t("noAccount") : t("hasAccount")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
