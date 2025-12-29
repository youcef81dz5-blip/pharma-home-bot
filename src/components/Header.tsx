import { Link } from "react-router-dom";
import { Pill, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 glass-card border-b border-border/50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-soft">
            <Pill className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground">صيدلي البيت</span>
            <span className="text-xs text-muted-foreground">PHARMA HOME</span>
          </div>
        </div>
        <Link to="/inventory">
          <Button variant="outline" size="sm" className="gap-2">
            <Package className="h-4 w-4" />
            المخزون
          </Button>
        </Link>
      </div>
    </header>
  );
}
