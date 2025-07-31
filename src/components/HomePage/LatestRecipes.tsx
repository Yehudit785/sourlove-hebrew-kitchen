import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface Recipe {
  id: string;
  title: string;
  description: string;
  prep_time: number;
  cook_time: number;
  difficulty: string;
  image_url: string;
  category_id: string;
  categories: {
    name_hebrew: string;
  };
}

export function LatestRecipes() {
  const { data: recipes, isLoading } = useQuery({
    queryKey: ['latest-recipes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          categories (
            name_hebrew
          )
        `)
        .order('created_at', { ascending: false })
        .limit(4);
      
      if (error) throw error;
      return data as Recipe[];
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 60 * 1000, // 60 seconds
  });

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">המתכונים החדשים שלנו</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-48 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">המתכונים החדשים שלנו</h2>
          <div className="text-center text-muted-foreground">
            <p>עדיין אין מתכונים. בקרוב נוסיף מתכונים טעימים!</p>
          </div>
        </div>
      </section>
    );
  }

  const [featured, ...others] = recipes;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">המתכונים החדשים שלנו</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Featured Recipe - Larger */}
          {featured && (
            <Link to={`/recipe/${featured.id}`} className="group">
              <Card className="overflow-hidden hover-scale border-primary/20 hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <img 
                    src={featured.image_url || "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"}
                    alt={featured.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-background/90">
                      {featured.categories?.name_hebrew}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {featured.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {featured.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{featured.prep_time + featured.cook_time} דק'</span>
                    </div>
                    <Badge variant="outline">{featured.difficulty}</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
          
          {/* Other Recipes - Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {others.map((recipe) => (
              <Link key={recipe.id} to={`/recipe/${recipe.id}`} className="group">
                <Card className="overflow-hidden hover-scale border-primary/20 hover:shadow-lg transition-all duration-300">
                  <div className="relative">
                    <img 
                      src={recipe.image_url || "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"}
                      alt={recipe.title}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-1">
                      {recipe.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{recipe.prep_time + recipe.cook_time} דק'</span>
                      <Badge variant="outline" className="text-xs">{recipe.difficulty}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
