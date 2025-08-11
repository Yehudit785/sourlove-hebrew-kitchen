import { Search, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "react-router-dom";
import { useSearch } from "@/hooks/useSearch";
import { SearchResults } from "@/components/SearchResults";
import { useState, useRef, useEffect } from "react";

export function Navbar() {
  const location = useLocation();
  const { searchQuery, setSearchQuery, searchResults, isSearching } = useSearch();
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowResults(e.target.value.trim().length > 0);
  };

  const handleSearchFocus = () => {
    if (searchQuery.trim().length > 0) {
      setShowResults(true);
    }
  };
  
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
              S
            </div>
            <span className="font-bold text-xl text-foreground">SourLove</span>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-12 space-x-reverse">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              דף הבית
            </Link>
            <Link 
              to="/recipes" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/recipes') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              מתכונים
            </Link>
            <Link 
              to="/videos" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/videos') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              סרטונים
            </Link>
          </div>
          
          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            <div ref={searchRef} className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="חיפוש מתכונים..."
                className="pl-10 w-64 bg-muted/50"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
              />
              {showResults && (
                <SearchResults
                  results={searchResults}
                  isSearching={isSearching}
                  onClose={() => setShowResults(false)}
                />
              )}
            </div>
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex justify-center space-x-10">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              דף הבית
            </Link>
            <Link 
              to="/recipes" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/recipes') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              מתכונים
            </Link>
            <Link 
              to="/videos" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/videos') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              סרטונים
            </Link>
          </div>
          <div className="mt-4">
            <div ref={searchRef} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="חיפוש מתכונים..."
                className="pl-10 w-full bg-muted/50"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
              />
              {showResults && (
                <SearchResults
                  results={searchResults}
                  isSearching={isSearching}
                  onClose={() => setShowResults(false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
