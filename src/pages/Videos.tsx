import { Navbar } from "@/components/Layout/Navbar";

export default function Videos() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">סרטוני הכנה</h1>
        <div className="text-center text-muted-foreground py-16">
          <p>דף הסרטונים בפיתוח. בקרוב תוכלו לצפות בסרטוני הכנה מפורטים!</p>
        </div>
      </div>
    </div>
  );
}