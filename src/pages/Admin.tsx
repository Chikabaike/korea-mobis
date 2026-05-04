import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, LogOut, Plus, Trash2, Save, ArrowLeft, Pencil, X, Loader2, Settings } from 'lucide-react';
import { StoreProvider, useStore } from '@/context/StoreContext';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';
import type { BrandData, CarCompatibility, CarPart, FuelType, GenerationData, ModelData } from '@/types';
import { toast } from 'sonner';
import { addWatermark } from '@/lib/watermark';
import { DEFAULT_WATERMARK, loadWatermarkSettings, saveWatermarkSettings, type WatermarkSettings } from '@/lib/watermarkSettings';

const FUELS: FuelType[] = ['Бензин', 'Дизель', 'LPG/LPI', 'Hybrid'];

/* ============================ AUTH ============================ */

const Login = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success('Аккаунт создан. Если потребуется, подтвердите email и войдите.');
        setMode('login');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Ошибка';
      setError(msg);
    } finally {
      setBusy(false);
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
          <p className="text-xs text-muted-foreground">Вход для владельца</p>
        </div>
        <input
          type="email" autoFocus required value={email}
          onChange={(e) => { setEmail(e.target.value); setError(''); }}
          placeholder="Email"
          className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="password" required minLength={6} value={password}
          onChange={(e) => { setPassword(e.target.value); setError(''); }}
          placeholder="Пароль (мин. 6 символов)"
          className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {error && <p className="text-xs text-destructive text-center">{error}</p>}
        <button type="submit" disabled={busy} className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg text-sm hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">
          {busy && <Loader2 size={14} className="animate-spin" />}
          {mode === 'login' ? 'Войти' : 'Создать аккаунт'}
        </button>
        <Link to="/" className="flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft size={12} /> На сайт
        </Link>
      </form>
    </div>
  );
};

/* ============================ TABS ============================ */

type Tab = 'parts' | 'categories' | 'cars' | 'settings' | 'admins';

/* ============================ PARTS ============================ */

const emptyPart = (categories: string[]): CarPart => ({
  id: 'new-' + Date.now().toString(),
  name: '',
  category: categories[0] ?? '',
  price: 0,
  image: '',
  compatibility: ['Бензин'],
  cars: [],
  partNumber: '',
  partNumbers: [],
});

const PartsTab = () => {
  const { parts, categories, upsertPart, deletePart } = useStore();
  const [editing, setEditing] = useState<CarPart | null>(null);

  const save = async (p: CarPart) => {
    try { await upsertPart(p); setEditing(null); toast.success('Сохранено'); }
    catch (e) { toast.error(e instanceof Error ? e.message : 'Ошибка'); }
  };

  const remove = async (id: string) => {
    if (!confirm('Удалить запчасть?')) return;
    try { await deletePart(id); toast.success('Удалено'); }
    catch (e) { toast.error(e instanceof Error ? e.message : 'Ошибка'); }
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
            {p.image
              ? <img src={p.image} alt={p.name} className="w-16 h-16 rounded-lg object-cover bg-muted" />
              : <div className="w-16 h-16 rounded-lg bg-muted" />}
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm truncate">{p.name || '—'}</div>
              <div className="text-xs text-muted-foreground">{p.category} · {p.price === -1 ? 'Договорная' : `${p.price.toLocaleString('ru-RU')} сом`}</div>
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
  onSave: (p: CarPart) => void | Promise<void>;
  onCancel: () => void;
}) => {
  const { brands, uploadImage } = useStore();
  const [draft, setDraft] = useState<CarPart>({ ...part, cars: part.cars ?? [] });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

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

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const watermarked = await addWatermark(file);
      const url = await uploadImage(watermarked);
      setDraft({ ...draft, image: url });
      toast.success('Фото загружено с водяным знаком');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Не удалось загрузить фото');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try { await onSave(draft); } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()} className="bg-card rounded-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h3 className="font-black text-lg">{part.id.startsWith('new-') ? 'Новая запчасть' : 'Редактировать'}</h3>
          <button onClick={onCancel}><X size={18} /></button>
        </div>
        <Field label="Название">
          <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="input" />
        </Field>
        <Field label="Артикул">
          <input
            value={draft.partNumber ?? ''}
            onChange={(e) => setDraft({ ...draft, partNumber: e.target.value })}
            placeholder="Внутренний артикул"
            className="input"
          />
        </Field>
        <Field label="Номера запчасти">
          <PartNumbersEditor
            value={draft.partNumbers ?? []}
            onChange={(list) => setDraft({ ...draft, partNumbers: list })}
          />
        </Field>
        <Field label="Категория">
          <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className="input">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Цена (сом)">
          <div className="space-y-2">
            <input
              type="number"
              value={draft.price === -1 ? '' : draft.price}
              onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
              className="input"
              disabled={draft.price === -1}
              placeholder={draft.price === -1 ? 'Договорная' : ''}
            />
            <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={draft.price === -1}
                onChange={(e) => setDraft({ ...draft, price: e.target.checked ? -1 : 0 })}
              />
              Договорная цена
            </label>
          </div>
        </Field>
        <Field label="Фото запчасти">
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 rounded-lg bg-muted border border-border overflow-hidden flex items-center justify-center shrink-0">
              {uploading
                ? <Loader2 size={18} className="animate-spin text-muted-foreground" />
                : draft.image
                  ? <img src={draft.image} alt="" className="w-full h-full object-cover" />
                  : <span className="text-[10px] text-muted-foreground">нет фото</span>}
            </div>
            <div className="flex-1 space-y-2">
              <input
                type="file" accept="image/*" onChange={onPickFile} disabled={uploading}
                className="block w-full text-xs file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground file:font-bold file:cursor-pointer cursor-pointer"
              />
              {draft.image && (
                <button type="button" onClick={() => setDraft({ ...draft, image: '' })} className="text-xs text-destructive hover:opacity-70">
                  Удалить фото
                </button>
              )}
              <p className="text-[10px] text-muted-foreground">Фото загружается в облако и видно всем посетителям сайта.</p>
            </div>
          </div>
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
        <button onClick={handleSave} disabled={saving || uploading} className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-3 rounded-lg disabled:opacity-50">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Сохранить
        </button>
      </div>
    </div>
  );
};

const PartNumbersEditor = ({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) => {
  const [input, setInput] = useState('');

  const add = () => {
    const v = input.trim();
    if (!v) return;
    if (value.includes(v)) { setInput(''); return; }
    onChange([...value, v]);
    setInput('');
  };

  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder="Напр. 28113-2P000"
          className="input flex-1"
        />
        <button
          type="button"
          onClick={add}
          disabled={!input.trim()}
          className="bg-primary text-primary-foreground rounded-lg px-3 text-xs font-bold disabled:opacity-50 flex items-center gap-1"
        >
          <Plus size={12} /> Добавить
        </button>
      </div>
      {value.length === 0 ? (
        <p className="text-[11px] text-muted-foreground">Артикулы не добавлены.</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {value.map((n, i) => (
            <span key={n} className="inline-flex items-center gap-1 bg-muted border border-border rounded-full pl-3 pr-1 py-1 text-xs font-semibold">
              {n}
              <button type="button" onClick={() => remove(i)} className="text-destructive p-0.5 hover:opacity-70" aria-label="Удалить">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
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

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block space-y-1.5">
    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
    {children}
  </label>
);

/* ============================ CATEGORIES ============================ */

const CategoriesTab = () => {
  const { categories, setCategoriesList, renameCategory, parts } = useStore();
  const [name, setName] = useState('');

  const add = async () => {
    const v = name.trim();
    if (!v || categories.includes(v)) return;
    try { await setCategoriesList([...categories, v]); setName(''); }
    catch (e) { toast.error(e instanceof Error ? e.message : 'Ошибка'); }
  };

  const remove = async (c: string) => {
    const used = parts.some((p) => p.category === c);
    if (used && !confirm(`Категория "${c}" используется в товарах. Удалить?`)) return;
    try { await setCategoriesList(categories.filter((x) => x !== c)); }
    catch (e) { toast.error(e instanceof Error ? e.message : 'Ошибка'); }
  };

  const rename = async (c: string) => {
    const v = prompt('Новое название категории:', c);
    if (v === null) return;
    try { await renameCategory(c, v); toast.success('Переименовано'); }
    catch (e) { toast.error(e instanceof Error ? e.message : 'Ошибка'); }
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
            <div className="flex items-center gap-1">
              <button onClick={() => rename(c)} title="Переименовать" className="text-muted-foreground hover:text-foreground p-1"><Settings size={14} /></button>
              <button onClick={() => remove(c)} className="text-destructive p-1 hover:opacity-70"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ============================ CARS ============================ */

const CarsTab = () => {
  const { brands, setBrandsList } = useStore();
  const [newBrand, setNewBrand] = useState('');

  const update = async (next: BrandData[]) => {
    try { await setBrandsList(next); }
    catch (e) { toast.error(e instanceof Error ? e.message : 'Ошибка'); }
  };

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

  const renameBrand = (oldName: string) => {
    const v = prompt('Новое название марки:', oldName);
    if (v === null) return;
    const trimmed = v.trim();
    if (!trimmed || trimmed === oldName) return;
    if (brands.some((b) => b.name === trimmed)) { toast.error('Марка с таким именем уже есть'); return; }
    update(brands.map((b) => b.name === oldName ? { ...b, name: trimmed } : b));
  };

  const addModel = (brandName: string, modelName: string) =>
    update(brands.map((b) => b.name === brandName ? { ...b, models: [...b.models, { name: modelName, generations: [] }] } : b));

  const removeModel = (brandName: string, modelName: string) =>
    update(brands.map((b) => b.name === brandName ? { ...b, models: b.models.filter((m) => m.name !== modelName) } : b));

  const renameModel = (brandName: string, oldName: string) => {
    const v = prompt('Новое название модели:', oldName);
    if (v === null) return;
    const trimmed = v.trim();
    if (!trimmed || trimmed === oldName) return;
    update(brands.map((b) => {
      if (b.name !== brandName) return b;
      if (b.models.some((m) => m.name === trimmed)) { toast.error('Модель с таким именем уже есть'); return b; }
      return { ...b, models: b.models.map((m) => m.name === oldName ? { ...m, name: trimmed } : m) };
    }));
  };

  const updateModel = (brandName: string, modelName: string, fn: (m: ModelData) => ModelData) =>
    update(brands.map((b) => b.name === brandName ? { ...b, models: b.models.map((m) => m.name === modelName ? fn(m) : m) } : b));

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
            onRenameBrand={() => renameBrand(b.name)}
            onAddModel={(m) => addModel(b.name, m)}
            onRemoveModel={(m) => removeModel(b.name, m)}
            onRenameModel={(m) => renameModel(b.name, m)}
            onUpdateModel={(m, fn) => updateModel(b.name, m, fn)}
          />
        ))}
      </div>
    </div>
  );
};

const BrandBlock = ({ brand, onRemoveBrand, onRenameBrand, onAddModel, onRemoveModel, onRenameModel, onUpdateModel }: {
  brand: BrandData;
  onRemoveBrand: () => void;
  onRenameBrand: () => void;
  onAddModel: (name: string) => void;
  onRemoveModel: (name: string) => void;
  onRenameModel: (name: string) => void;
  onUpdateModel: (name: string, fn: (m: ModelData) => ModelData) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [modelName, setModelName] = useState('');

  return (
    <div className="bg-card border border-border rounded-xl">
      <div className="flex items-center justify-between p-4 gap-2">
        <button onClick={() => setOpen(!open)} className="font-bold text-left flex-1 min-w-0 truncate">
          {brand.name} <span className="text-xs text-muted-foreground font-normal">({brand.models.length} моделей)</span>
        </button>
        <button onClick={onRenameBrand} title="Переименовать" className="text-muted-foreground hover:text-foreground p-1"><Settings size={14} /></button>
        <button onClick={onRemoveBrand} className="text-destructive p-1"><Trash2 size={14} /></button>
      </div>
      {open && (
        <div className="border-t border-border p-4 space-y-3">
          <div className="flex gap-2">
            <input value={modelName} onChange={(e) => setModelName(e.target.value)} placeholder="Новая модель" className="input flex-1 text-sm" />
            <button onClick={() => { if (modelName.trim()) { onAddModel(modelName.trim()); setModelName(''); } }} className="bg-secondary text-secondary-foreground px-3 rounded-lg text-xs font-bold">+ Модель</button>
          </div>
          {brand.models.map((m) => (
            <ModelBlock key={m.name} model={m} onRemove={() => onRemoveModel(m.name)} onRename={() => onRenameModel(m.name)} onUpdate={(fn) => onUpdateModel(m.name, fn)} />
          ))}
        </div>
      )}
    </div>
  );
};

const ModelBlock = ({ model, onRemove, onRename, onUpdate }: { model: ModelData; onRemove: () => void; onRename: () => void; onUpdate: (fn: (m: ModelData) => ModelData) => void }) => {
  const [genName, setGenName] = useState('');

  const addGen = () => {
    if (!genName.trim()) return;
    onUpdate((m) => ({ ...m, generations: [...m.generations, { generationName: genName.trim(), fuels: ['Бензин'] }] }));
    setGenName('');
  };

  const removeGen = (name: string) => onUpdate((m) => ({ ...m, generations: m.generations.filter((g) => g.generationName !== name) }));

  const renameGen = (oldName: string) => {
    const v = prompt('Новое название поколения:', oldName);
    if (v === null) return;
    const trimmed = v.trim();
    if (!trimmed || trimmed === oldName) return;
    onUpdate((m) => {
      if (m.generations.some((g) => g.generationName === trimmed)) return m;
      return { ...m, generations: m.generations.map((g) => g.generationName === oldName ? { ...g, generationName: trimmed } : g) };
    });
  };

  const toggleFuel = (genName: string, f: FuelType) => onUpdate((m) => ({
    ...m,
    generations: m.generations.map((g) => g.generationName === genName ? { ...g, fuels: g.fuels.includes(f) ? g.fuels.filter((x) => x !== f) : [...g.fuels, f] } : g),
  }));

  return (
    <div className="bg-muted/40 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-sm flex-1 min-w-0 truncate">{model.name}</span>
        <button onClick={onRename} title="Переименовать" className="text-muted-foreground hover:text-foreground p-1"><Settings size={12} /></button>
        <button onClick={onRemove} className="text-destructive p-1"><Trash2 size={12} /></button>
      </div>
      <div className="flex gap-2">
        <input value={genName} onChange={(e) => setGenName(e.target.value)} placeholder="Поколение" className="input flex-1 text-xs py-2" />
        <button onClick={addGen} className="bg-card border border-border px-3 rounded-lg text-xs font-bold">+ Поколение</button>
      </div>
      {model.generations.map((g: GenerationData) => (
        <div key={g.generationName} className="bg-card rounded-md p-2 text-xs space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="flex-1 min-w-0 truncate">{g.generationName}</span>
            <button onClick={() => renameGen(g.generationName)} title="Переименовать" className="text-muted-foreground hover:text-foreground"><Settings size={11} /></button>
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
  const { settings, saveSettings } = useStore();
  const [draft, setDraft] = useState(settings);
  const [saving, setSaving] = useState(false);
  useEffect(() => setDraft(settings), [settings]);

  const handleSave = async () => {
    setSaving(true);
    try { await saveSettings(draft); toast.success('Сохранено'); }
    catch (e) { toast.error(e instanceof Error ? e.message : 'Ошибка'); }
    finally { setSaving(false); }
  };

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
      <button onClick={handleSave} disabled={saving} className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50">
        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Сохранить
      </button>

      <WatermarkSettingsBlock />
    </div>
  );
};

const WatermarkSettingsBlock = () => {
  const [wm, setWm] = useState<WatermarkSettings>(DEFAULT_WATERMARK);
  useEffect(() => { setWm(loadWatermarkSettings()); }, []);

  const update = (patch: Partial<WatermarkSettings>) => {
    const next = { ...wm, ...patch };
    setWm(next);
    saveWatermarkSettings(next);
  };

  return (
    <div className="pt-6 mt-6 border-t border-border space-y-4">
      <h2 className="text-lg font-black">Водяной знак для загрузок</h2>
      <p className="text-xs text-muted-foreground">Применяется автоматически ко всем фото запчастей при загрузке.</p>

      <label className="flex items-center justify-between bg-card border border-border rounded-lg px-4 py-3 cursor-pointer">
        <span className="text-sm font-bold">Включить водяной знак</span>
        <input
          type="checkbox"
          checked={wm.enabled}
          onChange={(e) => update({ enabled: e.target.checked })}
          className="w-5 h-5 accent-primary"
        />
      </label>

      <Field label="Текст">
        <input
          value={wm.text}
          onChange={(e) => update({ text: e.target.value })}
          className="input"
          disabled={!wm.enabled}
        />
      </Field>

      <Field label={`Прозрачность: ${Math.round(wm.opacity * 100)}%`}>
        <input
          type="range" min={5} max={100} step={5}
          value={Math.round(wm.opacity * 100)}
          onChange={(e) => update({ opacity: Number(e.target.value) / 100 })}
          disabled={!wm.enabled}
          className="w-full"
        />
      </Field>

      <Field label="Режим">
        <div className="grid grid-cols-2 gap-2">
          {(['diagonal', 'single'] as const).map((m) => (
            <button
              key={m}
              type="button"
              disabled={!wm.enabled}
              onClick={() => update({ mode: m })}
              className={`text-xs font-bold py-2 rounded border ${wm.mode === m ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border'} disabled:opacity-50`}
            >
              {m === 'diagonal' ? 'Диагональный' : 'Одиночный'}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Положение">
        <select
          value={wm.position}
          onChange={(e) => update({ position: e.target.value as WatermarkSettings['position'] })}
          disabled={!wm.enabled}
          className="input"
        >
          <option value="bottom-right">Снизу справа</option>
          <option value="bottom-left">Снизу слева</option>
          <option value="top-right">Сверху справа</option>
          <option value="top-left">Сверху слева</option>
          <option value="center">По центру</option>
        </select>
      </Field>

      <button
        type="button"
        onClick={() => { saveWatermarkSettings(DEFAULT_WATERMARK); setWm(DEFAULT_WATERMARK); toast.success('Сброшено'); }}
        className="text-xs text-muted-foreground hover:text-foreground underline"
      >
        Сбросить настройки
      </button>
    </div>
  );
};

/* ============================ ADMINS ============================ */

export const SUPER_ADMIN_EMAIL = 'pinkerton.7mailru@gmail.com';
export const isSuperAdminEmail = (e?: string | null) =>
  (e ?? '').trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

type AdminUser = { id: string; email: string; created_at: string; last_sign_in_at: string | null };

const AdminsTab = ({ currentEmail }: { currentEmail: string }) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [newEmail, setNewEmail] = useState('');
  const [newPass, setNewPass] = useState('');
  const [busy, setBusy] = useState(false);
  const [pwDraft, setPwDraft] = useState<Record<string, string>>({});

  const isSuper = isSuperAdminEmail(currentEmail);

  const load = async () => {
    setLoading(true); setError('');
    try {
      const { data, error } = await supabase.functions.invoke('list-admin-emails');
      if (error) throw error;
      setUsers((data as { users: AdminUser[] }).users ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const fmt = (s: string | null) => s ? new Date(s).toLocaleString('ru-RU') : '—';

  const createAdmin = async () => {
    if (!newEmail.trim() || newPass.length < 6) {
      toast.error('Нужен email и пароль ≥ 6 символов');
      return;
    }
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-admins', {
        body: { action: 'create', email: newEmail.trim(), password: newPass },
      });
      if (error) throw error;
      if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);
      toast.success('Админ создан');
      setNewEmail(''); setNewPass('');
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Ошибка');
    } finally {
      setBusy(false);
    }
  };

  const updatePassword = async (userId: string) => {
    const pass = pwDraft[userId] ?? '';
    if (pass.length < 6) { toast.error('Пароль ≥ 6 символов'); return; }
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-admins', {
        body: { action: 'update-password', userId, password: pass },
      });
      if (error) throw error;
      if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);
      toast.success('Пароль обновлён');
      setPwDraft((p) => ({ ...p, [userId]: '' }));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Ошибка');
    } finally {
      setBusy(false);
    }
  };

  const removeAdmin = async (userId: string, email: string) => {
    if (!confirm(`Удалить аккаунт ${email}?`)) return;
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-admins', {
        body: { action: 'delete', userId },
      });
      if (error) throw error;
      if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);
      toast.success('Удалено');
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Ошибка');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-black">Привязанные email админ-панели</h2>
          <p className="text-xs text-muted-foreground mt-1">
            {isSuper
              ? 'Вы вошли как главный админ. Можно добавлять и удалять админов, менять пароли.'
              : 'Просмотр доступен всем админам. Управление — только у главного админа.'}
          </p>
        </div>
        <button onClick={load} className="text-xs font-bold uppercase px-3 py-2 rounded-lg bg-muted hover:bg-muted/80">Обновить</button>
      </div>

      {isSuper && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="text-sm font-bold">Добавить нового админа</div>
          <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-2">
            <input
              type="email" placeholder="Email"
              value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
              className="input"
            />
            <input
              type="text" placeholder="Пароль (мин. 6 символов)"
              value={newPass} onChange={(e) => setNewPass(e.target.value)}
              className="input"
            />
            <button
              onClick={createAdmin}
              disabled={busy}
              className="bg-primary text-primary-foreground font-bold rounded-lg px-4 text-sm flex items-center gap-2 disabled:opacity-50"
            >
              {busy ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Создать
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
      ) : error ? (
        <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg p-3">{error}</div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-bold">Email</th>
                <th className="text-left px-4 py-3 font-bold">Создан</th>
                <th className="text-left px-4 py-3 font-bold">Последний вход</th>
                {isSuper && <th className="text-left px-4 py-3 font-bold">Управление</th>}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={isSuper ? 4 : 3} className="px-4 py-6 text-center text-muted-foreground">Нет аккаунтов</td></tr>
              ) : users.map(u => {
                const isThisSuper = isSuperAdminEmail(u.email);
                return (
                  <tr key={u.id} className="border-t border-border">
                    <td className="px-4 py-3 font-semibold">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span>{u.email || '—'}</span>
                        {isThisSuper && (
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-primary text-primary-foreground">
                            Главный
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{fmt(u.created_at)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{fmt(u.last_sign_in_at)}</td>
                    {isSuper && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <input
                            type="text"
                            placeholder="Новый пароль"
                            value={pwDraft[u.id] ?? ''}
                            onChange={(e) => setPwDraft((p) => ({ ...p, [u.id]: e.target.value }))}
                            className="input text-xs py-1.5 w-40"
                          />
                          <button
                            onClick={() => updatePassword(u.id)}
                            disabled={busy}
                            className="text-[11px] font-bold px-2 py-1.5 rounded bg-muted hover:bg-muted/80 disabled:opacity-50"
                          >
                            Сменить
                          </button>
                          {!isThisSuper && (
                            <button
                              onClick={() => removeAdmin(u.id, u.email)}
                              disabled={busy}
                              className="text-destructive p-1.5 hover:opacity-70 disabled:opacity-50"
                              title="Удалить"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};



const AdminShell = ({ onLogout, email }: { onLogout: () => void; email: string }) => {
  const [tab, setTab] = useState<Tab>('parts');
  const { loading } = useStore();
  const tabs: { id: Tab; label: string }[] = [
    { id: 'parts', label: 'Запчасти' },
    { id: 'categories', label: 'Категории' },
    { id: 'cars', label: 'Авто' },
    { id: 'settings', label: 'Настройки' },
    { id: 'admins', label: 'Админы' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/" className="text-muted-foreground hover:text-foreground"><ArrowLeft size={18} /></Link>
            <h1 className="font-black text-lg truncate">Админ-панель MOBIS</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-muted-foreground truncate max-w-[180px]">{email}</span>
            <button onClick={onLogout} className="flex items-center gap-1.5 text-xs font-bold uppercase text-muted-foreground hover:text-foreground">
              <LogOut size={14} /> Выйти
            </button>
          </div>
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
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-muted-foreground" /></div>
        ) : (
          <>
            {tab === 'parts' && <PartsTab />}
            {tab === 'categories' && <CategoriesTab />}
            {tab === 'cars' && <CarsTab />}
            {tab === 'settings' && <SettingsTab />}
            {tab === 'admins' && <AdminsTab currentEmail={email} />}
          </>
        )}
      </main>
    </div>
  );
};

const AdminInner = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!ready) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>;
  }
  if (!session) return <Login />;

  return (
    <AdminShell
      email={session.user.email ?? ''}
      onLogout={async () => { await supabase.auth.signOut(); }}
    />
  );
};

const Admin = () => (
  <StoreProvider>
    <AdminInner />
  </StoreProvider>
);

export default Admin;
