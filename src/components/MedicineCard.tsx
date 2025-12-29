import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar, Package, ChevronDown, ChevronUp, Edit2 } from "lucide-react";
import { EditMedicineDialog } from "./EditMedicineDialog";

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

interface MedicineCardProps {
  medicine: Medicine;
  onDelete: () => void;
  onRefresh: () => void;
}

export function MedicineCard({ medicine, onDelete, onRefresh }: MedicineCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const getExpiryStatus = () => {
    if (!medicine.expiry_date) return { status: "unknown", label: "غير محدد", color: "text-muted-foreground" };
    
    const daysRemaining = Math.ceil(
      (new Date(medicine.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    if (daysRemaining < 0) {
      return { status: "expired", label: "منتهي الصلاحية", color: "text-destructive", days: Math.abs(daysRemaining) };
    } else if (daysRemaining <= 30) {
      return { status: "critical", label: `${daysRemaining} يوم متبقي`, color: "text-destructive" };
    } else if (daysRemaining <= 90) {
      return { status: "warning", label: `${daysRemaining} يوم متبقي`, color: "text-warning" };
    }
    return { status: "safe", label: `${daysRemaining} يوم متبقي`, color: "text-success" };
  };

  const expiryStatus = getExpiryStatus();

  const getBorderColor = () => {
    switch (expiryStatus.status) {
      case "expired":
        return "border-destructive/50 bg-destructive/5";
      case "critical":
        return "border-destructive/30 bg-destructive/5";
      case "warning":
        return "border-warning/30 bg-warning/5";
      default:
        return "border-border/50";
    }
  };

  return (
    <>
      <div className={`glass-card rounded-xl border p-4 ${getBorderColor()}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-foreground">{medicine.name_ar}</h3>
            {medicine.scientific_name && (
              <p className="text-sm text-muted-foreground" dir="ltr">
                {medicine.scientific_name}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowEditDialog(true)}
            >
              <Edit2 className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span>{medicine.quantity}</span>
          </div>
          <div className={`flex items-center gap-1 ${expiryStatus.color}`}>
            <Calendar className="h-4 w-4" />
            <span>{expiryStatus.label}</span>
          </div>
        </div>

        {(medicine.primary_use || medicine.manufacturer || medicine.notes) && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-3 flex items-center gap-1 text-sm text-primary"
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  إخفاء التفاصيل
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  عرض التفاصيل
                </>
              )}
            </button>

            {expanded && (
              <div className="mt-3 space-y-2 border-t border-border/50 pt-3 text-sm">
                {medicine.primary_use && (
                  <div>
                    <span className="text-muted-foreground">الاستخدام: </span>
                    <span className="text-foreground">{medicine.primary_use}</span>
                  </div>
                )}
                {medicine.manufacturer && (
                  <div>
                    <span className="text-muted-foreground">الشركة المصنعة: </span>
                    <span className="text-foreground">{medicine.manufacturer}</span>
                  </div>
                )}
                {medicine.notes && (
                  <div>
                    <span className="text-muted-foreground">ملاحظات: </span>
                    <span className="text-foreground">{medicine.notes}</span>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <EditMedicineDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        medicine={medicine}
        onSuccess={onRefresh}
      />
    </>
  );
}
