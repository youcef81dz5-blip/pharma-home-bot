import { Link } from "react-router-dom";
import { Pill, Package, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeLanguageToggle } from "@/components/ThemeLanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";

export function Header() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-border/50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-soft">
            <Pill className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground">{t("appName")}</span>
            <span className="text-xs text-muted-foreground">{t("appSubtitle")}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <ThemeLanguageToggle />
          <Link to="/reminders">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <BellRing className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/inventory">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Package className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
