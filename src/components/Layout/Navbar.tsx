import { Search, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "react-router-dom";

export function Navbar() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
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
          <div className="hidden md:flex items-center space-x-8">
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
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="חיפוש מתכונים..."
                className="pl-10 w-64 bg-muted/50"
              />
            </div>
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex justify-center space-x-6">
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="חיפוש מתכונים..."
                className="pl-10 w-full bg-muted/50"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}