import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Navbar } from "@/components/Layout/Navbar";

interface Recipe {
  id: string;
  title: string;
  description: string;
  prep_time: number;
  cook_time: number;
  difficulty: string;
  image_url: string;
  category_id: string;
  isactive: boolean;
  categories: {
    name_hebrew: string;
  };
}

const RECIPES_PER_PAGE = 12;

export default function Recipes() {
  const [loadedCount, setLoadedCount] = useState(RECIPES_PER_PAGE);

  // Fetch all active recipes
  const { data: allRecipes, isLoading } = useQuery({
    queryKey: ['all-recipes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          categories (
            name_hebrew
          )
        `)
        .eq('isactive', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Recipe[];
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchInterval: 60 * 1000,
  });

  const displayedRecipes = allRecipes?.slice(0, loadedCount) || [];
  const hasMoreRecipes = allRecipes && allRecipes.length > loadedCount;

  const handleLoadMore = () => {
    setLoadedCount(prev => prev + RECIPES_PER_PAGE);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-center text-foreground">כל המתכונים</h1>
            <Skeleton className="h-4 w-32 mx-auto mt-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!allRecipes || allRecipes.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-center text-foreground">כל המתכונים</h1>
          </div>
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">
              עדיין אין מתכונים פעילים. בקרוב נוסיף מתכונים טעימים!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-foreground">כל המתכונים</h1>
          <p className="text-muted-foreground">
            {allRecipes.length} מתכונים פעילים
          </p>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {displayedRecipes.map((recipe) => (
            <Link key={recipe.id} to={`/recipe/${recipe.id}`} className="group">
              <Card className="overflow-hidden hover-scale border-primary/20 hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  <img 
                    src={recipe.image_url || "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"}
                    alt={recipe.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-background/90 text-xs">
                      {recipe.categories?.name_hebrew}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {recipe.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {recipe.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{(recipe.prep_time || 0) + (recipe.cook_time || 0)} דק'</span>
                    {recipe.difficulty && (
                      <Badge variant="outline" className="text-xs">{recipe.difficulty}</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Load More Section */}
        {hasMoreRecipes && (
          <div className="text-center">
            <Button 
              onClick={handleLoadMore}
              variant="outline"
              size="lg"
              className="px-8"
            >
              טען עוד מתכונים
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}