import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { MedicineCard } from "@/components/MedicineCard";
import { AddMedicineDialog } from "@/components/AddMedicineDialog";
import { AddFromImageDialog } from "@/components/AddFromImageDialog";
import { SymptomSearch } from "@/components/SymptomSearch";

import { ThemeLanguageToggle } from "@/components/ThemeLanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus, Search, Package, AlertTriangle, LogOut, Camera, Upload } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface Medicine {
  id: string;
  name_ar: string;
  scientific_name: string | null;
  manufacturer: string | null;
  primary_use: string | null;
  quantity: number;
  expiry_date: string | null;
  notes: string | null;
}

export default function Inventory() {
  const [user, setUser] = useState<User | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, dir } = useLanguage();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchMedicines();
    }
  }, [user]);

  const fetchMedicines = async () => {
    try {
      const { data, error } = await supabase
        .from("medicine_inventory")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMedicines(data || []);
    } catch (error) {
      console.error("Error fetching medicines:", error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("loadError"),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleDeleteMedicine = async (id: string) => {
    try {
      const { error } = await supabase
        .from("medicine_inventory")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setMedicines(medicines.filter((m) => m.id !== id));
      toast({
        title: t("deleted"),
        description: t("deletedDesc"),
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("deleteError"),
      });
    }
  };

  const filteredMedicines = medicines.filter(
    (m) =>
      m.name_ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.scientific_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const expiringMedicines = medicines.filter((m) => {
    if (!m.expiry_date) return false;
    const daysRemaining = Math.ceil(
      (new Date(m.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return daysRemaining <= 90 && daysRemaining > 0;
  });

  const expiredMedicines = medicines.filter((m) => {
    if (!m.expiry_date) return false;
    return new Date(m.expiry_date) < new Date();
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <header className="sticky top-0 z-50 glass-card border-b border-border/50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-soft">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground">{t("medicineInventory")}</span>
              <span className="text-xs text-muted-foreground">{t("manageHomeMedicine")}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeLanguageToggle />
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container pb-20 pt-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="glass-card rounded-xl p-4 text-center border border-border/50">
            <p className="text-2xl font-bold text-primary">{medicines.length}</p>
            <p className="text-xs text-muted-foreground">{t("totalMedicines")}</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center border border-warning/30 bg-warning/5">
            <p className="text-2xl font-bold text-warning">{expiringMedicines.length}</p>
            <p className="text-xs text-muted-foreground">{t("expiringSoon")}</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center border border-destructive/30 bg-destructive/5">
            <p className="text-2xl font-bold text-destructive">{expiredMedicines.length}</p>
            <p className="text-xs text-muted-foreground">{t("expired")}</p>
          </div>
        </div>

        {/* Alerts */}
        {(expiringMedicines.length > 0 || expiredMedicines.length > 0) && (
          <div className="mb-6 space-y-2">
            {expiredMedicines.length > 0 && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/30 p-3">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <p className="text-sm text-destructive">
                  {t("expiredAlert", { count: expiredMedicines.length })}
                </p>
              </div>
            )}
            {expiringMedicines.length > 0 && (
              <div className="flex items-center gap-2 rounded-lg bg-warning/10 border border-warning/30 p-3">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <p className="text-sm text-warning">
                  {t("expiringAlert", { count: expiringMedicines.length })}
                </p>
              </div>
            )}
          </div>
        )}


        {/* Symptom Search */}
        {medicines.length > 0 && (
          <SymptomSearch medicines={medicines} />
        )}

        {/* Search and Add */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:right-3 ltr:left-3" />
            <Input
              placeholder={t("searchMedicine")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-10"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setShowImageDialog(true)}
            >
              <Camera className="h-4 w-4" />
              <span className="hidden sm:inline">{t("captureImage")}</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setShowImageDialog(true)}
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">{t("uploadImageBtn")}</span>
            </Button>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{t("addNewMedicine")}</span>
            </Button>
          </div>
        </div>

        {/* Medicine List */}
        {filteredMedicines.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchQuery ? t("noResults") : t("noMedicines")}
            </p>
            {!searchQuery && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setShowAddDialog(true)}
              >
                <Plus className="h-4 w-4 ml-2 rtl:ml-2 ltr:mr-2" />
                {t("addNewMedicine")}
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMedicines.map((medicine) => (
              <MedicineCard
                key={medicine.id}
                medicine={medicine}
                onDelete={() => handleDeleteMedicine(medicine.id)}
                onRefresh={fetchMedicines}
              />
            ))}
          </div>
        )}
      </main>

      <AddMedicineDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={fetchMedicines}
      />

      <AddFromImageDialog
        open={showImageDialog}
        onOpenChange={setShowImageDialog}
        onSuccess={fetchMedicines}
      />
    </div>
  );
}
