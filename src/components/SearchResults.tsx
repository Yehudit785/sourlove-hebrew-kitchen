import { Link } from 'react-router-dom';
import { Clock, ChefHat } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Recipe } from '@/hooks/useSearch';

interface SearchResultsProps {
  results: Recipe[];
  isSearching: boolean;
  onClose: () => void;
}

export function SearchResults({ results, isSearching, onClose }: SearchResultsProps) {
  if (isSearching) {
    return (
      <div className="absolute top-full left-0 right-0 bg-background border border-border rounded-md shadow-lg z-50 mt-1">
        <div className="p-4 text-center text-muted-foreground">
          מחפש מתכונים...
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 bg-background border border-border rounded-md shadow-lg z-50 mt-1 max-h-96 overflow-y-auto">
      <div className="p-2">
        {results.map((recipe) => (
          <Link
            key={recipe.id}
            to={`/recipe/${recipe.id}`}
            onClick={(e) => {
              e.preventDefault();
              onClose();
              window.location.href = `/recipe/${recipe.id}`;
            }}
            className="block p-3 hover:bg-muted rounded-md transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-3">
              {recipe.image_url && (
                <img
                  src={recipe.image_url}
                  alt={recipe.title}
                  className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-foreground truncate">
                  {recipe.title}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {recipe.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {recipe.prep_time + recipe.cook_time} דקות
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {recipe.difficulty}
                  </Badge>
                  {recipe.categories && (
                    <Badge variant="outline" className="text-xs">
                      {recipe.categories.name_hebrew}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}