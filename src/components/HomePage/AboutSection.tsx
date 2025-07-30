export function AboutSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-accent/20 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 animate-gentle-fade">
            ברוכים הבאים ל-SourLove
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed animate-gentle-fade">
            אני מבשלת מאז שאני זוכרת את עצמי - באהבה גדולה לאוכל פשוט, טעים ומנחם. 
            כאן תמצאו מתכונים קלים להכנה שתמיד מצליחים ותמיד עושים חשק לעוד.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="bg-primary/10 rounded-full p-6">
              <div className="text-4xl">💝</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}