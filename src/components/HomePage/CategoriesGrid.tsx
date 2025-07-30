import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface Category {
  id: string;
  name_hebrew: string;
  description: string;
  image_url?: string;
  hover_color?: string;
}

const categoryEmojis: Record<string, string> = {
  'עוגיות': '🍪',
  'מאפים מלוחים': '🥐',
  'סלטים': '🥗',
  'ממרחים ורטבים': '🍯',
  'ארוחה מהירה': '⚡',
  'ארוחה בסיר אחד': '🍲',
  'אוכל שילדים אוהבים': '😋',
  'אירוח': '🎉'
};

export function CategoriesGrid() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name_hebrew');
      
      if (error) throw error;
      return data as Category[];
    }
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">קטגוריות מתכונים</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-full w-24 h-24 mx-auto mb-4"></div>
                <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">קטגוריות מתכונים</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {categories?.map((category) => (
            <Link 
              key={category.id} 
              to={`/category/${category.id}`}
              className="group"
            >
              <div className="flex flex-col items-center text-center">
                <div 
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-3xl md:text-4xl bg-card border-2 border-primary/20 group-hover:border-primary/50 hover-scale shadow-lg group-hover:shadow-xl transition-all duration-300"
                  style={{ backgroundColor: category.hover_color ? `${category.hover_color}20` : undefined }}
                >
                  {categoryEmojis[category.name_hebrew] || '🍽️'}
                </div>
                <h3 className="mt-4 font-semibold text-sm md:text-base text-foreground group-hover:text-primary transition-colors">
                  {category.name_hebrew}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}