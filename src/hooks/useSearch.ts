import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  prep_time: number;
  cook_time: number;
  difficulty: string;
  categories: { name_hebrew: string } | null;
  isactive: boolean;
}

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const searchRecipes = async () => {
      setIsSearching(true);
      try {
        const { data, error } = await supabase
          .from('recipes')
          .select(`
            *,
            categories(name_hebrew)
          `)
          .eq('isactive', true)
          .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        setSearchResults(data || []);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchRecipes, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
  };
}