import Header from '@/components/Header';
import FilterWidget from '@/components/FilterWidget';
import Catalog from '@/components/Catalog';

const CatalogPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl p-3 sm:p-6 lg:p-8 space-y-5">
          <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
            <FilterWidget orientation="horizontal" />
          </div>
          <Catalog />
        </div>
      </main>
      <footer className="bg-card border-t border-border py-5 sm:py-6 px-4 text-center text-[9px] sm:text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
        © 2026 MOBIS — Intellectual Parts System · Bishkek
      </footer>
    </div>
  );
};

export default CatalogPage;
