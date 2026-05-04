import { createContext, useContext, useState, ReactNode } from 'react';
import type { Language } from '../types';

const translations = {
  ru: {
    searchPlaceholder: 'Поиск по наименованию или номеру запчасти...',
    selectBrand: 'Выберите марку',
    selectModel: 'Выберите модель',
    selectGeneration: 'Выберите поколение',
    engineType: 'Тип двигателя',
    resetFilters: 'Сбросить фильтры',
    allParts: 'ВСЕ ЗАПЧАСТИ',
    lastParts: 'ПОСЛЕДНИЕ ПОСТУПЛЕНИЯ',
    noPartsFound: 'Ничего не найдено',
    noPartsDesc: 'Попробуйте изменить параметры поиска.',
    filters: 'ФИЛЬТРЫ',
    catalog: 'Каталог',
    map: 'Магазин',
    contactWhatsapp: 'Связаться через WhatsApp',
    compatibility: 'Совместимость',
    category: 'Категория',
    art: 'Артикул',
    promo: 'Бесплатная доставка по Бишкеку при заказе от 5000 сом',
    address: 'г. Бишкек, ул. Ибраимова 115',
    workHours: 'Пн–Сб 9:00 – 19:00',
    inStock: 'В наличии',
  },
  kg: {
    searchPlaceholder: 'Аталышы же запчасть номери боюнча издөө...',
    selectBrand: 'Марканы тандаңыз',
    selectModel: 'Моделди тандаңыз',
    selectGeneration: 'Муунду тандаңыз',
    engineType: 'Кыймылдаткыч түрү',
    resetFilters: 'Фильтрлерди тазалоо',
    allParts: 'БАРДЫК ЗАПЧАСТАР',
    lastParts: 'АКЫРКЫ КЕЛГЕНДЕР',
    noPartsFound: 'Эч нерсе табылган жок',
    noPartsDesc: 'Издөө параметрлерин өзгөртүп көрүңүз.',
    filters: 'ФИЛЬТРЛЕР',
    catalog: 'Каталог',
    map: 'Дүкөн',
    contactWhatsapp: 'WhatsApp аркылуу байланышуу',
    compatibility: 'Шайкештик',
    category: 'Категория',
    art: 'Артикул',
    promo: 'Бишкек боюнча 5000 сомдон жогорку буюртмага текин жеткирүү',
    address: 'Бишкек ш., Ибраимов көч. 115',
    workHours: 'Дш–Иш 9:00 – 19:00',
    inStock: 'Бар',
  },
} as const;

type T = { [K in keyof typeof translations.ru]: string };

interface Ctx {
  language: Language;
  setLanguage: (l: Language) => void;
  t: T;
}

const LanguageContext = createContext<Ctx | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('ru');
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};