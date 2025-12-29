import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

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

interface EditMedicineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medicine: Medicine;
  onSuccess: () => void;
}

export function EditMedicineDialog({ open, onOpenChange, medicine, onSuccess }: EditMedicineDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name_ar: "",
    scientific_name: "",
    manufacturer: "",
    primary_use: "",
    quantity: 1,
    expiry_date: "",
    notes: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    if (medicine) {
      setFormData({
        name_ar: medicine.name_ar,
        scientific_name: medicine.scientific_name || "",
        manufacturer: medicine.manufacturer || "",
        primary_use: medicine.primary_use || "",
        quantity: medicine.quantity,
        expiry_date: medicine.expiry_date || "",
        notes: medicine.notes || "",
      });
    }
  }, [medicine]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("medicine_inventory")
        .update({
          ...formData,
          expiry_date: formData.expiry_date || null,
        })
        .eq("id", medicine.id);

      if (error) throw error;

      toast({
        title: "تم التحديث",
        description: "تم تحديث بيانات الدواء بنجاح",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error.message || "فشل في تحديث الدواء",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>تعديل الدواء</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit_name_ar">اسم الدواء *</Label>
            <Input
              id="edit_name_ar"
              value={formData.name_ar}
              onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_scientific_name">الاسم العلمي</Label>
            <Input
              id="edit_scientific_name"
              value={formData.scientific_name}
              onChange={(e) => setFormData({ ...formData, scientific_name: e.target.value })}
              dir="ltr"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="edit_quantity">الكمية</Label>
              <Input
                id="edit_quantity"
                type="number"
                min={1}
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_expiry_date">تاريخ الانتهاء</Label>
              <Input
                id="edit_expiry_date"
                type="date"
                value={formData.expiry_date}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_manufacturer">الشركة المصنعة</Label>
            <Input
              id="edit_manufacturer"
              value={formData.manufacturer}
              onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_primary_use">الاستخدام الأساسي</Label>
            <Input
              id="edit_primary_use"
              value={formData.primary_use}
              onChange={(e) => setFormData({ ...formData, primary_use: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_notes">ملاحظات</Label>
            <Textarea
              id="edit_notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "جاري التحديث..." : "حفظ التعديلات"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
