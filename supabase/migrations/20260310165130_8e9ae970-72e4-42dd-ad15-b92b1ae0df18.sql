
CREATE TABLE public.saved_prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  prescription_date text,
  doctor_name text,
  institution text,
  diagnosis_summary text,
  general_advice text,
  doctor_notes text,
  medicines jsonb NOT NULL DEFAULT '[]'::jsonb,
  image_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.saved_prescriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own prescriptions"
  ON public.saved_prescriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own prescriptions"
  ON public.saved_prescriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prescriptions"
  ON public.saved_prescriptions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
