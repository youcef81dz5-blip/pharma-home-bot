import { Link } from "react-router-dom";
import { Pill, Package, BellRing, Home, FileText, Info, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeLanguageToggle } from "@/components/ThemeLanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { t, dir } = useLanguage();

  const navItems = [
    { to: "/", icon: Home, labelKey: "home" as const, fallback: "الرئيسية" },
    { to: "/inventory", icon: Package, labelKey: "inventory" as const, fallback: "المخزون" },
    { to: "/reminders", icon: BellRing, labelKey: "reminders" as const, fallback: "التذكيرات" },
    { to: "/prescriptions", icon: FileText, labelKey: "prescriptions" as const, fallback: "الوصفات" },
    { to: "/about", icon: Info, labelKey: "about" as const, fallback: "عن التطبيق" },
  ];

  const safeT = (key: string, fallback: string) => {
    const v = t(key as never);
    return v && v !== key ? v : fallback;
  };

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9" aria-label="Menu">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={dir === "rtl" ? "start" : "end"} className="w-56 bg-background z-50">
              <DropdownMenuLabel>{safeT("menu", "القائمة")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {navItems.map(({ to, icon: Icon, labelKey, fallback }) => (
                <DropdownMenuItem key={to} asChild className="cursor-pointer">
                  <Link to={to} className="flex items-center gap-2 w-full">
                    <Icon className="h-4 w-4 text-primary" />
                    <span>{safeT(labelKey, fallback)}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
