-- Scope all RLS policies to the authenticated role for defence-in-depth

-- medicine_inventory
ALTER POLICY "Users can view their own medicines" ON public.medicine_inventory TO authenticated;
ALTER POLICY "Users can create their own medicines" ON public.medicine_inventory TO authenticated;
ALTER POLICY "Users can update their own medicines" ON public.medicine_inventory TO authenticated;
ALTER POLICY "Users can delete their own medicines" ON public.medicine_inventory TO authenticated;

-- medication_reminders
ALTER POLICY "Users can view their own reminders" ON public.medication_reminders TO authenticated;
ALTER POLICY "Users can create their own reminders" ON public.medication_reminders TO authenticated;
ALTER POLICY "Users can update their own reminders" ON public.medication_reminders TO authenticated;
ALTER POLICY "Users can delete their own reminders" ON public.medication_reminders TO authenticated;