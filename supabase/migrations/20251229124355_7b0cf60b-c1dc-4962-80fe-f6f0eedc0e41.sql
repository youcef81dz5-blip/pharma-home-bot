-- Create home medicine inventory table
CREATE TABLE public.medicine_inventory (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    name_ar TEXT NOT NULL,
    scientific_name TEXT,
    manufacturer TEXT,
    primary_use TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    expiry_date DATE,
    notes TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.medicine_inventory ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own medicines" 
ON public.medicine_inventory 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own medicines" 
ON public.medicine_inventory 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medicines" 
ON public.medicine_inventory 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medicines" 
ON public.medicine_inventory 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_medicine_inventory_updated_at
BEFORE UPDATE ON public.medicine_inventory
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();