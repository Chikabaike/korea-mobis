import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, LogOut, Plus, Trash2, Save, RotateCcw, ArrowLeft, Pencil, X } from 'lucide-react';
import { StoreProvider, useStore, ADMIN_PASSWORD, ADMIN_PASSWORD_KEY } from '@/context/StoreContext';
import type { BrandData, CarCompatibility, CarPart, FuelType, GenerationData, ModelData } from '@/types';

const FUELS: FuelType[] = ['Бензин', 'Дизель', 'LPG/LPI', 'Hybrid'];

/* ============================ AUTH ============================ */

const Login = ({ onSuccess }: { onSuccess: () => void }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_PASSWORD_KEY, '1');
      onSuccess();
    } else {
      setError('Неверный пароль');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-card border border-border rounded-2xl p-8 space-y-5 shadow-xl">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock size={20} className="text-primary" />
          </div>
          <h1 className="text-xl font-black text-foreground">Админ-панель</h1>
          <p className="text-xs text-muted-foreground">Введите пароль для входа</p>
        </div>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(''); }}
          placeholder="Пароль"
          className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {error && <p className="text-xs text-destructive text-center">{error}</p>}
        <button type="submit" className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg text-sm hover:opacity-90 transition">
          Войти
        </button>
        <p className="text-[10px] text-muted-foreground text-center">
          По умолчанию: <code className="bg-muted px-1.5 py-0.5 rounded">admin123</code>
        </p>
        <Link to="/" className="flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft size={12} /> На сайт
        </Link>
      </form>
    </div>
  );
};

/* ============================ TABS ============================ */

type Tab = 'parts' | 'categories' | 'cars' | 'settings';

/* ============================ PARTS ============================ */

const emptyPart = (categories: string[]): CarPart => ({
  id: Date.now().toString(),
  name: '',
  category: categories[0] ?? '',
  price: 0,
  image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=450&fit=crop',
  compatibility: ['Бензин'],
});

const PartsTab = () => {
  const { parts, setParts, categories } = useStore();
  const [editing, setEditing] = useState<CarPart | null>(null);

  const save = (p: CarPart) => {
    const exists = parts.find((x) => x.id === p.id);
    setParts(exists ? parts.map((x) => (x.id === p.id ? p : x)) : [...parts, p]);
    setEditing(null);
  };

  const remove = (id: string) => {
    if (confirm('Удалить запчасть?')) setParts(parts.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-black">Запчасти ({parts.length})</h2>
        <button onClick={() => setEditing(emptyPart(categories))} className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold">
          <Plus size={14} /> Добавить
        </button>
      </div>

      <div className="grid gap-3">
        {parts.map((p) => (
          <div key={p.id} className="bg-card border border-border rounded-xl p-3 flex items-center gap-3">
            <img src={p.image} alt={p.name} className="w-16 h-16 rounded-lg object-cover bg-muted" />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm truncate">{p.name || '—'}</div>
              <div className="text-xs text-muted-foreground">{p.category} · {p.price.toLocaleString('ru-RU')} сом</div>
              <div className="flex gap-1 mt-1 flex-wrap">
                {p.compatibility.map((f) => (
                  <span key={f} className="text-[9px] bg-muted px-1.5 py-0.5 rounded">{f}</span>
                ))}
              </div>
            </div>
            <button onClick={() => setEditing(p)} className="p-2 text-muted-foreground hover:text-foreground"><Pencil size={16} /></button>
            <button onClick={() => remove(p.id)} className="p-2 text-destructive hover:opacity-70"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>

      {editing && <PartEditor part={editing} categories={categories} onSave={save} onCancel={() => setEditing(null)} />}
    </div>
  );
};

const PartEditor = ({ part, categories, onSave, onCancel }: {
  part: CarPart;
  categories: string[];
  onSave: (p: CarPart) => void;
  onCancel: () => void;
}) => {
  const { brands } = useStore();
  const [draft, setDraft] = useState<CarPart>({ ...part, cars: part.cars ?? [] });
  const toggleFuel = (f: FuelType) => {
    setDraft({ ...draft, compatibility: draft.compatibility.includes(f) ? draft.compatibility.filter((x) => x !== f) : [...draft.compatibility, f] });
  };

  const cars = draft.cars ?? [];
  const removeCar = (idx: number) => setDraft({ ...draft, cars: cars.filter((_, i) => i !== idx) });
  const addCar = (c: CarCompatibility) => {
    const dup = cars.some((x) => x.brand === c.brand && x.model === c.model && (x.generation ?? '') === (c.generation ?? ''));
    if (dup) return;
    setDraft({ ...draft, cars: [...cars, c] });
  };

  return (
    <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()} className="bg-card rounded-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h3 className="font-black text-lg">{parts_isNew(part) ? 'Новая запчасть' : 'Редактировать'}</h3>
          <button onClick={onCancel}><X size={18} /></button>
        </div>
        <Field label="Название">
          <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="input" />
        </Field>
        <Field label="Категория">
          <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className="input">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Цена (сом)">
          <input type="number" value={draft.price} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })} className="input" />
        </Field>
        <Field label="URL изображения">
          <input value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} className="input" />
        </Field>
        <Field label="Совместимость с топливом">
          <div className="grid grid-cols-2 gap-2">
            {FUELS.map((f) => (
              <button key={f} type="button" onClick={() => toggleFuel(f)} className={`text-xs font-bold py-2 rounded border ${draft.compatibility.includes(f) ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border'}`}>
                {f}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Совместимые автомобили">
          <CarPicker brands={brands} onAdd={addCar} />
          <div className="mt-2 space-y-1.5">
            {cars.length === 0 && (
              <p className="text-xs text-muted-foreground">Не выбрано — запчасть будет считаться универсальной по авто.</p>
            )}
            {cars.map((c, i) => (
              <div key={i} className="flex items-center justify-between bg-muted rounded-lg px-3 py-2 text-xs">
                <span className="font-medium">
                  {c.brand} · {c.model}
                  {c.generation ? <span className="text-muted-foreground"> · {c.generation}</span> : <span className="text-muted-foreground"> · все поколения</span>}
                </span>
                <button type="button" onClick={() => removeCar(i)} className="text-destructive p-1"><X size={12} /></button>
              </div>
            ))}
          </div>
        </Field>
        <button onClick={() => onSave(draft)} className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-3 rounded-lg">
          <Save size={14} /> Сохранить
        </button>
      </div>
    </div>
  );
};

const CarPicker = ({ brands, onAdd }: { brands: BrandData[]; onAdd: (c: CarCompatibility) => void }) => {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [generation, setGeneration] = useState('');

  const brandObj = brands.find((b) => b.name === brand);
  const modelObj = brandObj?.models.find((m) => m.name === model);

  const add = () => {
    if (!brand || !model) return;
    onAdd({ brand, model, generation: generation || undefined });
    setGeneration('');
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-2">
      <select value={brand} onChange={(e) => { setBrand(e.target.value); setModel(''); setGeneration(''); }} className="input text-xs">
        <option value="">Марка</option>
        {brands.map((b) => <option key={b.name} value={b.name}>{b.name}</option>)}
      </select>
      <select value={model} onChange={(e) => { setModel(e.target.value); setGeneration(''); }} disabled={!brandObj} className="input text-xs disabled:opacity-50">
        <option value="">Модель</option>
        {brandObj?.models.map((m) => <option key={m.name} value={m.name}>{m.name}</option>)}
      </select>
      <select value={generation} onChange={(e) => setGeneration(e.target.value)} disabled={!modelObj} className="input text-xs disabled:opacity-50">
        <option value="">Все поколения</option>
        {modelObj?.generations.map((g) => <option key={g.generationName} value={g.generationName}>{g.generationName}</option>)}
      </select>
      <button type="button" onClick={add} disabled={!brand || !model} className="bg-primary text-primary-foreground rounded-lg px-3 text-xs font-bold disabled:opacity-50 flex items-center justify-center gap-1">
        <Plus size={12} /> Добавить
      </button>
    </div>
  );
};

// Best-effort: show "Новая" if id is a recent timestamp (>= 10 digits)
const parts_isNew = (p: CarPart) => /^\d{13,}$/.test(p.id);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block space-y-1.5">
    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
    {children}
  </label>
);

/* ============================ CATEGORIES ============================ */

const CategoriesTab = () => {
  const { categories, setCategories, parts } = useStore();
  const [name, setName] = useState('');

  const add = () => {
    const v = name.trim();
    if (!v || categories.includes(v)) return;
    setCategories([...categories, v]);
    setName('');
  };

  const remove = (c: string) => {
    const used = parts.some((p) => p.category === c);
    if (used && !confirm(`Категория "${c}" используется в товарах. Удалить?`)) return;
    setCategories(categories.filter((x) => x !== c));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-black">Категории ({categories.length})</h2>
      <div className="flex gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} placeholder="Новая категория" className="input flex-1" />
        <button onClick={add} className="bg-primary text-primary-foreground px-4 rounded-lg font-bold text-sm flex items-center gap-1.5"><Plus size={14} /> Добавить</button>
      </div>
      <div className="grid gap-2">
        {categories.map((c) => (
          <div key={c} className="flex items-center justify-between bg-card border border-border rounded-lg px-4 py-3">
            <span className="font-medium text-sm">{c}</span>
            <button onClick={() => remove(c)} className="text-destructive p-1 hover:opacity-70"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ============================ CARS ============================ */

const CarsTab = () => {
  const { brands, setBrands } = useStore();
  const [newBrand, setNewBrand] = useState('');

  const update = (next: BrandData[]) => setBrands(next);

  const addBrand = () => {
    const v = newBrand.trim();
    if (!v || brands.find((b) => b.name === v)) return;
    update([...brands, { name: v, models: [] }]);
    setNewBrand('');
  };

  const removeBrand = (name: string) => {
    if (!confirm(`Удалить бренд "${name}"?`)) return;
    update(brands.filter((b) => b.name !== name));
  };

  const addModel = (brandName: string, modelName: string) => {
    update(brands.map((b) => b.name === brandName ? { ...b, models: [...b.models, { name: modelName, generations: [] }] } : b));
  };

  const removeModel = (brandName: string, modelName: string) => {
    update(brands.map((b) => b.name === brandName ? { ...b, models: b.models.filter((m) => m.name !== modelName) } : b));
  };

  const updateModel = (brandName: string, modelName: string, fn: (m: ModelData) => ModelData) => {
    update(brands.map((b) => b.name === brandName ? { ...b, models: b.models.map((m) => m.name === modelName ? fn(m) : m) } : b));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-black">Авто: марки → модели → поколения</h2>
      <div className="flex gap-2">
        <input value={newBrand} onChange={(e) => setNewBrand(e.target.value)} placeholder="Новая марка" className="input flex-1" />
        <button onClick={addBrand} className="bg-primary text-primary-foreground px-4 rounded-lg font-bold text-sm flex items-center gap-1.5"><Plus size={14} /> Марка</button>
      </div>

      <div className="space-y-3">
        {brands.map((b) => (
          <BrandBlock
            key={b.name}
            brand={b}
            onRemoveBrand={() => removeBrand(b.name)}
            onAddModel={(m) => addModel(b.name, m)}
            onRemoveModel={(m) => removeModel(b.name, m)}
            onUpdateModel={(m, fn) => updateModel(b.name, m, fn)}
          />
        ))}
      </div>
    </div>
  );
};

const BrandBlock = ({ brand, onRemoveBrand, onAddModel, onRemoveModel, onUpdateModel }: {
  brand: BrandData;
  onRemoveBrand: () => void;
  onAddModel: (name: string) => void;
  onRemoveModel: (name: string) => void;
  onUpdateModel: (name: string, fn: (m: ModelData) => ModelData) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [modelName, setModelName] = useState('');

  return (
    <div className="bg-card border border-border rounded-xl">
      <div className="flex items-center justify-between p-4">
        <button onClick={() => setOpen(!open)} className="font-bold text-left flex-1">
          {brand.name} <span className="text-xs text-muted-foreground font-normal">({brand.models.length} моделей)</span>
        </button>
        <button onClick={onRemoveBrand} className="text-destructive p-1"><Trash2 size={14} /></button>
      </div>
      {open && (
        <div className="border-t border-border p-4 space-y-3">
          <div className="flex gap-2">
            <input value={modelName} onChange={(e) => setModelName(e.target.value)} placeholder="Новая модель" className="input flex-1 text-sm" />
            <button onClick={() => { if (modelName.trim()) { onAddModel(modelName.trim()); setModelName(''); } }} className="bg-secondary text-secondary-foreground px-3 rounded-lg text-xs font-bold">+ Модель</button>
          </div>
          {brand.models.map((m) => (
            <ModelBlock key={m.name} model={m} onRemove={() => onRemoveModel(m.name)} onUpdate={(fn) => onUpdateModel(m.name, fn)} />
          ))}
        </div>
      )}
    </div>
  );
};

const ModelBlock = ({ model, onRemove, onUpdate }: { model: ModelData; onRemove: () => void; onUpdate: (fn: (m: ModelData) => ModelData) => void }) => {
  const [genName, setGenName] = useState('');

  const addGen = () => {
    if (!genName.trim()) return;
    onUpdate((m) => ({ ...m, generations: [...m.generations, { generationName: genName.trim(), fuels: ['Бензин'] }] }));
    setGenName('');
  };

  const removeGen = (name: string) => onUpdate((m) => ({ ...m, generations: m.generations.filter((g) => g.generationName !== name) }));

  const toggleFuel = (genName: string, f: FuelType) => onUpdate((m) => ({
    ...m,
    generations: m.generations.map((g) => g.generationName === genName ? { ...g, fuels: g.fuels.includes(f) ? g.fuels.filter((x) => x !== f) : [...g.fuels, f] } : g),
  }));

  return (
    <div className="bg-muted/40 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm">{model.name}</span>
        <button onClick={onRemove} className="text-destructive p-1"><Trash2 size={12} /></button>
      </div>
      <div className="flex gap-2">
        <input value={genName} onChange={(e) => setGenName(e.target.value)} placeholder="Поколение" className="input flex-1 text-xs py-2" />
        <button onClick={addGen} className="bg-card border border-border px-3 rounded-lg text-xs font-bold">+ Поколение</button>
      </div>
      {model.generations.map((g) => (
        <div key={g.generationName} className="bg-card rounded-md p-2 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span>{g.generationName}</span>
            <button onClick={() => removeGen(g.generationName)} className="text-destructive"><Trash2 size={11} /></button>
          </div>
          <div className="flex gap-1 flex-wrap">
            {FUELS.map((f) => (
              <button key={f} onClick={() => toggleFuel(g.generationName, f)} className={`text-[10px] px-2 py-0.5 rounded border ${g.fuels.includes(f) ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ============================ SETTINGS ============================ */

const SettingsTab = () => {
  const { settings, setSettings, resetAll } = useStore();
  const [draft, setDraft] = useState(settings);
  useEffect(() => setDraft(settings), [settings]);

  return (
    <div className="space-y-4 max-w-xl">
      <h2 className="text-lg font-black">Контакты и баннер</h2>
      <Field label="Промо-баннер (RU)"><input value={draft.promoRu} onChange={(e) => setDraft({ ...draft, promoRu: e.target.value })} className="input" /></Field>
      <Field label="Промо-баннер (KG)"><input value={draft.promoKg} onChange={(e) => setDraft({ ...draft, promoKg: e.target.value })} className="input" /></Field>
      <Field label="Адрес (RU)"><input value={draft.addressRu} onChange={(e) => setDraft({ ...draft, addressRu: e.target.value })} className="input" /></Field>
      <Field label="Адрес (KG)"><input value={draft.addressKg} onChange={(e) => setDraft({ ...draft, addressKg: e.target.value })} className="input" /></Field>
      <Field label="Часы работы (RU)"><input value={draft.workHoursRu} onChange={(e) => setDraft({ ...draft, workHoursRu: e.target.value })} className="input" /></Field>
      <Field label="Часы работы (KG)"><input value={draft.workHoursKg} onChange={(e) => setDraft({ ...draft, workHoursKg: e.target.value })} className="input" /></Field>
      <Field label="Телефон"><input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} className="input" /></Field>
      <Field label="WhatsApp (без +)"><input value={draft.whatsapp} onChange={(e) => setDraft({ ...draft, whatsapp: e.target.value })} className="input" /></Field>
      <button onClick={() => setSettings(draft)} className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg flex items-center justify-center gap-2"><Save size={14} /> Сохранить</button>
      <div className="border-t border-border pt-4">
        <button onClick={() => { if (confirm('Сбросить ВСЕ данные к исходным?')) resetAll(); }} className="w-full text-destructive border border-destructive/40 font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-destructive/10">
          <RotateCcw size={14} /> Сбросить все данные
        </button>
      </div>
    </div>
  );
};

/* ============================ SHELL ============================ */

const AdminShell = ({ onLogout }: { onLogout: () => void }) => {
  const [tab, setTab] = useState<Tab>('parts');
  const tabs: { id: Tab; label: string }[] = [
    { id: 'parts', label: 'Запчасти' },
    { id: 'categories', label: 'Категории' },
    { id: 'cars', label: 'Авто' },
    { id: 'settings', label: 'Настройки' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-foreground"><ArrowLeft size={18} /></Link>
            <h1 className="font-black text-lg">Админ-панель MOBIS</h1>
          </div>
          <button onClick={onLogout} className="flex items-center gap-1.5 text-xs font-bold uppercase text-muted-foreground hover:text-foreground">
            <LogOut size={14} /> Выйти
          </button>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition ${tab === t.id ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {tab === 'parts' && <PartsTab />}
        {tab === 'categories' && <CategoriesTab />}
        {tab === 'cars' && <CarsTab />}
        {tab === 'settings' && <SettingsTab />}
      </main>
    </div>
  );
};

const AdminInner = () => {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(ADMIN_PASSWORD_KEY) === '1');
  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;
  return <AdminShell onLogout={() => { sessionStorage.removeItem(ADMIN_PASSWORD_KEY); setAuthed(false); }} />;
};

const Admin = () => (
  <StoreProvider>
    <AdminInner />
  </StoreProvider>
);

export default Admin;