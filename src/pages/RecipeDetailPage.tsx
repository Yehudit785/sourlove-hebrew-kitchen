import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Layout/Navbar";
import { CommentsSection } from "@/components/CommentsSection.tsx";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Users, ChefHat } from "lucide-react";
import { useState } from "react";

interface Recipe {
  id: string;
  title: string;
  description: string;
  prep_time: number;
  cook_time: number;
  difficulty: string;
  image_url: string;
  category_id: string;
  ingredients: {
    language: string;
    created_at: string;
    ingredients: Array<{
      id: number;
      name: string;
      unit: string;
      name_en: string;
      unit_he: string;
      quantity: number;
      emoji?: string;
    }>;
    recipe_type: string;
    total_items: number;
  };
  instructions: {
    steps: Array<{
      step: number;
      description: string;
    }>;
  };
  categories: {
    name_hebrew: string;
  };
}

const mockComments = [
  { id: 1, username: "שרה כהן", comment: "מתכון מעולה! יצא לי טעים מאוד, כל המשפחה אהבה", time: "לפני יומיים" },
  { id: 2, username: "דני לוי", comment: "הכנתי אתמול בערב, הטעם פשוט נהדר. תודה על השיתוף!", time: "לפני שבוע" },
  { id: 3, username: "מיכל אברהם", comment: "התוצאה הייתה מושלמת! קל להכנה וטעים מאוד", time: "לפני שבועיים" }
];

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

  const { data: recipe, isLoading, error } = useQuery({
    queryKey: ['recipe', id],
    queryFn: async () => {
      if (!id) throw new Error('Recipe ID is required');
      
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          categories (
            name_hebrew
          )
        `)
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) throw new Error('Recipe not found');
      return data;
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchInterval: 60 * 1000,
  });

  const toggleIngredient = (ingredientId: number) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(ingredientId)) {
      newChecked.delete(ingredientId);
    } else {
      newChecked.add(ingredientId);
    }
    setCheckedIngredients(newChecked);
  };

  const checkedCount = checkedIngredients.size;
  const ingredients = recipe?.ingredients as any;
  const instructions = recipe?.instructions as any;
  const totalIngredients = ingredients?.total_items || ingredients?.ingredients?.length || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-64 w-full rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">המתכון לא נמצא</h1>
            <p className="text-muted-foreground mb-6">מצטערים, המתכון שחיפשת אינו קיים או שהוסר</p>
            <Link to="/" className="text-primary hover:underline">
              חזרה לעמוד הבית
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{recipe.title}</h1>
            <div className="flex justify-center items-center gap-4 flex-wrap">
              <Link to={`/category/${recipe.category_id}`}>
                <Badge variant="secondary" className="hover:bg-secondary/80 transition-colors">
                  {recipe.categories?.name_hebrew}
                </Badge>
              </Link>
              {recipe.difficulty && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <ChefHat className="h-3 w-3" />
                  {recipe.difficulty}
                </Badge>
              )}
            </div>
          </div>

          {/* Hero Image */}
          <div className="w-full">
            <div className="aspect-[4/3] md:aspect-[16/9] rounded-lg overflow-hidden shadow-lg">
              <img 
                src={recipe.image_url || "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"}
                alt={recipe.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">מרכיבים</h3>
                </div>
                <p className="text-2xl font-bold text-primary">
                  {totalIngredients} מרכיבים
                </p>
                {checkedCount > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {checkedCount} מתוך {totalIngredients} מוכנים
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">זמן הכנה כולל</h3>
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-foreground">
                    הכנה: {recipe.prep_time} דק' | בישול: {recipe.cook_time} דק'
                  </p>
                  <p className="text-sm text-muted-foreground">
                    סה״כ: {recipe.prep_time + recipe.cook_time} דקות
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ingredients Section */}
          {ingredients && ingredients.ingredients && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6 text-right">מרכיבים</h2>
                <div className="space-y-3">
                  {ingredients.ingredients.map((ingredient: any) => (
                    <div 
                      key={ingredient.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => toggleIngredient(ingredient.id)}
                    >
                      <Checkbox 
                        checked={checkedIngredients.has(ingredient.id)}
                        onCheckedChange={() => toggleIngredient(ingredient.id)}
                        className="flex-shrink-0"
                      />
                      <div className={`flex items-center gap-2 text-right flex-1 ${
                        checkedIngredients.has(ingredient.id) 
                          ? 'line-through text-muted-foreground' 
                          : 'text-foreground'
                      } transition-all`}>
                        {ingredient.emoji && (
                          <span className="text-lg">{ingredient.emoji}</span>
                        )}
                        <span className="font-medium">
                          {ingredient.quantity} {ingredient.unit_he} {ingredient.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions Section */}
          {instructions && instructions.steps && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6 text-right">הוראות הכנה</h2>
                <div className="space-y-4">
                  {instructions.steps.map((step: any) => (
                    <div key={step.step} className="flex gap-4 text-right">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                        {step.step}
                      </div>
                      <p className="text-foreground leading-relaxed flex-1">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comments Section */}
          <div className="mb-8">
            <CommentsSection recipeId={id} />
          </div>

        </div>
      </div>
    </div>
  );
}