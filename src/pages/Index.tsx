import { useRef, useState } from 'react';
import Header from '@/components/Header';
import PromoBanner from '@/components/PromoBanner';
import FilterWidget from '@/components/FilterWidget';
import Catalog from '@/components/Catalog';
import LatestPartsSection from '@/components/LatestPartsSection';
import StoreMap from '@/components/StoreMap';
import { FilterProvider } from '@/context/FilterContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { StoreProvider } from '@/context/StoreContext';
import { ThemeProvider } from '@/context/ThemeContext';

const AppContent = () => {
  const [showLatest, setShowLatest] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleGo = () => {
    setShowLatest(true);
    setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl p-3 sm:p-6 lg:p-8 space-y-5">
          <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
            <FilterWidget orientation="horizontal" onGo={handleGo} />
          </div>

          {showLatest && (
            <div ref={sectionRef}>
              <LatestPartsSection onClose={() => setShowLatest(false)} />
            </div>
          )}

          <Catalog />

          <StoreMap />
        </div>
      </main>

      <footer className="bg-card border-t border-border py-5 sm:py-6 px-4 text-center text-[9px] sm:text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
        © 2026 MOBIS — Intellectual Parts System · Bishkek
      </footer>
    </div>
  );
};

const Index = () => (
  <ThemeProvider>
    <StoreProvider>
      <LanguageProvider>
        <FilterProvider>
          <AppContent />
        </FilterProvider>
      </LanguageProvider>
    </StoreProvider>
  </ThemeProvider>
);

export default Index;
