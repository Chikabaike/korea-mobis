import { useState } from 'react';
import { Filter as FilterIcon, X } from 'lucide-react';
import Header from '@/components/Header';
import PromoBanner from '@/components/PromoBanner';
import FilterWidget from '@/components/FilterWidget';
import Catalog from '@/components/Catalog';
import { FilterProvider } from '@/context/FilterContext';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';

const AppContent = () => {
  const { t } = useLanguage();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <PromoBanner />
      <Header />

      <main className="flex-1 flex relative">
        <aside className="w-72 bg-card border-r border-border p-6 shrink-0 hidden lg:block sticky top-0 h-screen overflow-y-auto">
          <FilterWidget />
        </aside>

        {!showMobileFilters && (
          <button
            onClick={() => setShowMobileFilters(true)}
            className="fixed bottom-6 left-6 z-40 lg:hidden flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-3 rounded-full shadow-2xl active:scale-95 transition-all"
          >
            <FilterIcon size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">{t.filters}</span>
          </button>
        )}

        {showMobileFilters && (
          <>
            <div
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-sm lg:hidden animate-in fade-in"
            />
            <div className="fixed inset-y-0 left-0 z-[70] w-full sm:w-80 bg-card shadow-2xl lg:hidden flex flex-col animate-in slide-in-from-left">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-black uppercase text-foreground tracking-wider">{t.filters}</h3>
                <button onClick={() => setShowMobileFilters(false)} className="p-2 text-muted-foreground hover:text-foreground">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <FilterWidget onSelection={() => setShowMobileFilters(false)} />
              </div>
            </div>
          </>
        )}

        <section className="flex-1 min-w-0">
          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            <Catalog />
          </div>
        </section>
      </main>

      <footer className="bg-card border-t border-border py-6 text-center text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
        © 2026 MOBIS — Intellectual Parts System · Bishkek
      </footer>
    </div>
  );
};

const Index = () => (
  <LanguageProvider>
    <FilterProvider>
      <AppContent />
    </FilterProvider>
  </LanguageProvider>
);

export default Index;
