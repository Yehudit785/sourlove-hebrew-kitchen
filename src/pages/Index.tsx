import { Navbar } from "@/components/Layout/Navbar";
import { AboutSection } from "@/components/HomePage/AboutSection";
import { LatestRecipes } from "@/components/HomePage/LatestRecipes";
import { CategoriesGrid } from "@/components/HomePage/CategoriesGrid";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <AboutSection />
        <LatestRecipes />
        <CategoriesGrid />
      </main>
    </div>
  );
}
