import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Navbar } from '@/components/Layout/Navbar';
import { supabase } from '@/integrations/supabase/client';
import type { Recipe } from '@/hooks/useSearch';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!query.trim()) return;
    
    const searchRecipes = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('recipes')
          .select(`
            *,
            categories(name_hebrew)
          `)
          .eq('isactive', true)
          .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
          .order('created_at', { ascending: false })
          .range(0, 11);

        if (error) throw error;
        setRecipes(data || []);
        setHasMore((data?.length || 0) === 12);
      } catch (error) {
        console.error('Search error:', error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    searchRecipes();
    setPage(1);
  }, [query]);

  const loadMore = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          categories(name_hebrew)
        `)
        .eq('isactive', true)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .range(page * 12, (page + 1) * 12 - 1);

      if (error) throw error;
      setRecipes(prev => [...prev, ...(data || [])]);
      setHasMore((data?.length || 0) === 12);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Load more error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            תוצאות חיפוש עבור "{query}"
          </h1>
          <p className="text-muted-foreground">
            נמצאו {recipes.length} מתכונים
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-full mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recipes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((recipe) => (
                <Link key={recipe.id} to={`/recipe/${recipe.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                    {recipe.image_url && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={recipe.image_url}
                          alt={recipe.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 text-foreground line-clamp-2">
                        {recipe.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {recipe.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {recipe.prep_time + recipe.cook_time} דקות
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="secondary">
                            {recipe.difficulty}
                          </Badge>
                          {recipe.categories && (
                            <Badge variant="outline">
                              {recipe.categories.name_hebrew}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            
            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button onClick={loadMore} variant="outline">
                  טען עוד מתכונים
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              לא נמצאו מתכונים
            </h2>
            <p className="text-muted-foreground">
              נסה לחפש במילים אחרות או עיין במתכונים הפופולריים
            </p>
            <Link to="/recipes" className="inline-block mt-4">
              <Button>צפה בכל המתכונים</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}