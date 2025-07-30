-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_hebrew TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  hover_color TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recipes table
CREATE TABLE public.recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  prep_time INTEGER, -- in minutes
  cook_time INTEGER, -- in minutes
  difficulty TEXT CHECK (difficulty IN ('קל', 'בינוני', 'קשה')), -- Easy, Medium, Hard in Hebrew
  category_id UUID REFERENCES public.categories(id),
  video_url TEXT,
  image_url TEXT,
  ingredients JSON, -- Array of ingredient objects
  instructions JSON, -- Array of instruction steps
  popularity_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tags table
CREATE TABLE public.tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_hebrew TEXT NOT NULL UNIQUE,
  emoji TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recipe_tags junction table
CREATE TABLE public.recipe_tags (
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (recipe_id, tag_id)
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (recipes are public content)
CREATE POLICY "Categories are publicly readable" 
ON public.categories FOR SELECT 
USING (true);

CREATE POLICY "Recipes are publicly readable" 
ON public.recipes FOR SELECT 
USING (true);

CREATE POLICY "Tags are publicly readable" 
ON public.tags FOR SELECT 
USING (true);

CREATE POLICY "Recipe tags are publicly readable" 
ON public.recipe_tags FOR SELECT 
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_recipes_category_id ON public.recipes(category_id);
CREATE INDEX idx_recipes_created_at ON public.recipes(created_at DESC);
CREATE INDEX idx_recipes_popularity ON public.recipes(popularity_count DESC);
CREATE INDEX idx_recipe_tags_recipe_id ON public.recipe_tags(recipe_id);
CREATE INDEX idx_recipe_tags_tag_id ON public.recipe_tags(tag_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON public.recipes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample categories
INSERT INTO public.categories (name_hebrew, description, hover_color) VALUES
('עוגיות', 'מתכונים לעוגיות טעימות ופריכות', '#FFB6C1'),
('מאפים מלוחים', 'מאפים מלוחים לכל שעות היום', '#B19CD9'),
('סלטים', 'סלטים טריים ובריאים', '#98D8C8'),
('ממרחים ורטבים', 'ממרחים ורטבים ביתיים', '#FFE4B5'),
('ארוחה מהירה', 'מתכונים מהירים לימי חול', '#F0E68C'),
('ארוחה בסיר אחד', 'מתכונים נוחים בסיר אחד', '#DDA0DD'),
('אוכל שילדים אוהבים', 'מתכונים שילדים פשוט חולשים עליהם', '#98FB98'),
('אירוח', 'מתכונים מיוחדים לאירוח', '#F5DEB3');

-- Insert sample tags
INSERT INTO public.tags (name_hebrew, emoji) VALUES
('טבעוני', '🌱'),
('ללא גלוטן', '🌾'),
('צמחוני', '🥬'),
('מהיר', '⚡'),
('בריא', '💚'),
('קל', '😊'),
('מתוק', '🍯'),
('חריף', '🌶️');