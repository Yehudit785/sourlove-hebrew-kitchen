-- Add isactive column to recipes table
ALTER TABLE public.recipes 
ADD COLUMN isactive BOOLEAN NOT NULL DEFAULT true;

-- Create index for better performance when querying active recipes
CREATE INDEX idx_recipes_isactive ON public.recipes(isactive) WHERE isactive = true;