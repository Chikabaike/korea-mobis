import { BrandData, CarPart } from '../types';

export const BRANDS: BrandData[] = [
  {
    name: 'Hyundai',
    models: [
      {
        name: 'Solaris / Accent',
        generations: [
          { generationName: '2 поколение (RB): 2010 – 2017', fuels: ['Бензин'] },
          { generationName: '3 поколение (HCi): 2017 – 2022', fuels: ['Бензин'] },
          { generationName: '4 поколение (BN7): 2023 – н.в.', fuels: ['Бензин'] },
        ],
      },
      {
        name: 'Elantra / Avante',
        generations: [
          { generationName: '5 поколение (MD): 2010 – 2016', fuels: ['Бензин'] },
          { generationName: '6 поколение (AD): 2015 – 2020', fuels: ['Бензин', 'LPG/LPI', 'Дизель'] },
          { generationName: '7 поколение (CN7): 2020 – н.в.', fuels: ['Бензин', 'Hybrid', 'LPG/LPI'] },
        ],
      },
      {
        name: 'Sonata',
        generations: [
          { generationName: '6 поколение (YF): 2010 – 2015', fuels: ['Бензин', 'Hybrid', 'LPG/LPI'] },
          { generationName: '7 поколение (LF): 2015 – 2019', fuels: ['Бензин', 'LPG/LPI', 'Hybrid'] },
          { generationName: '8 поколение (DN8): 2019 – н.в.', fuels: ['Бензин', 'Hybrid'] },
        ],
      },
      {
        name: 'Tucson / ix35',
        generations: [
          { generationName: '2 поколение (LM): 2010 – 2015', fuels: ['Бензин', 'Дизель'] },
          { generationName: '3 поколение (TL): 2015 – 2020', fuels: ['Бензин', 'Дизель'] },
          { generationName: '4 поколение (NX4): 2020 – н.в.', fuels: ['Бензин', 'Дизель', 'Hybrid'] },
        ],
      },
      {
        name: 'Santa Fe',
        generations: [
          { generationName: '3 поколение (DM): 2012 – 2018', fuels: ['Бензин', 'Дизель'] },
          { generationName: '4 поколение (TM): 2018 – 2023', fuels: ['Бензин', 'Дизель', 'Hybrid'] },
        ],
      },
      {
        name: 'Palisade',
        generations: [{ generationName: '1 поколение (LX2): 2018 – н.в.', fuels: ['Бензин', 'Дизель'] }],
      },
      {
        name: 'Staria / H-1',
        generations: [
          { generationName: '1 поколение (TQ): 2007 – 2021', fuels: ['Дизель', 'LPG/LPI'] },
          { generationName: '2 поколение (Staria): 2021 – н.в.', fuels: ['Дизель', 'Бензин'] },
        ],
      },
    ],
  },
  {
    name: 'Kia',
    models: [
      {
        name: 'Rio',
        generations: [
          { generationName: '3 поколение (UB): 2011 – 2017', fuels: ['Бензин'] },
          { generationName: '4 поколение (FB): 2017 – 2023', fuels: ['Бензин'] },
        ],
      },
      {
        name: 'Cerato / K3',
        generations: [
          { generationName: '3 поколение (YD): 2013 – 2018', fuels: ['Бензин', 'LPG/LPI'] },
          { generationName: '4 поколение (BD): 2018 – 2024', fuels: ['Бензин', 'Hybrid'] },
        ],
      },
      {
        name: 'Sportage',
        generations: [
          { generationName: '3 поколение (SL): 2010 – 2015', fuels: ['Бензин', 'Дизель'] },
          { generationName: '4 поколение (QL): 2015 – 2021', fuels: ['Бензин', 'Дизель'] },
          { generationName: '5 поколение (NQ5): 2021 – н.в.', fuels: ['Бензин', 'Дизель', 'Hybrid'] },
        ],
      },
      {
        name: 'Sorento',
        generations: [
          { generationName: '3 поколение (UM): 2014 – 2020', fuels: ['Бензин', 'Дизель'] },
          { generationName: '4 поколение (MQ4): 2020 – н.в.', fuels: ['Бензин', 'Дизель', 'Hybrid'] },
        ],
      },
      {
        name: 'K5 / Optima',
        generations: [
          { generationName: '4 поколение (JF): 2015 – 2020', fuels: ['Бензин', 'Hybrid'] },
          { generationName: '5 поколение (DL3): 2020 – н.в.', fuels: ['Бензин', 'Hybrid', 'LPG/LPI'] },
        ],
      },
    ],
  },
];

export const PARTS: CarPart[] = [
  {
    id: '1',
    name: 'Масляный фильтр Premium',
    category: 'Фильтры',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=450&fit=crop',
    compatibility: ['Бензин', 'Дизель', 'Hybrid', 'LPG/LPI'],
  },
  {
    id: '2',
    name: 'Тормозные колодки передние',
    category: 'Тормозная система',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1595113333346-3b999cb51c09?w=600&h=450&fit=crop',
    compatibility: ['Бензин', 'Дизель', 'Hybrid', 'LPG/LPI'],
  },
  {
    id: '3',
    name: 'Свеча зажигания Platinum',
    category: 'Зажигание',
    price: 800,
    image: 'https://images.unsplash.com/photo-1621252179027-94459d278441?w=600&h=450&fit=crop',
    compatibility: ['Бензин', 'LPG/LPI'],
  },
  {
    id: '4',
    name: 'Батарея ВВБ (Высоковольтная)',
    category: 'Электроника',
    price: 185000,
    image: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=600&h=450&fit=crop',
    compatibility: ['Hybrid'],
  },
  {
    id: '5',
    name: 'Газовый фильтр LPI (тонкая очистка)',
    category: 'ГБО',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1518130839000-580743b679a9?w=600&h=450&fit=crop',
    compatibility: ['LPG/LPI'],
  },
  {
    id: '6',
    name: 'Редуктор газовый LPG',
    category: 'ГБО',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1616432043562-3671ea2e5258?w=600&h=450&fit=crop',
    compatibility: ['LPG/LPI'],
  },
  {
    id: '7',
    name: 'Свечи накала (комплект 4 шт)',
    category: 'Двигатель',
    price: 6500,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=450&fit=crop',
    compatibility: ['Дизель'],
  },
  {
    id: '8',
    name: 'Инвертор системы гибрид',
    category: 'Электроника',
    price: 75000,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=450&fit=crop',
    compatibility: ['Hybrid'],
  },
  {
    id: '9',
    name: 'Воздушный фильтр салона',
    category: 'Фильтры',
    price: 950,
    image: 'https://images.unsplash.com/photo-1632823471565-1ecdf5c3636f?w=600&h=450&fit=crop',
    compatibility: ['Бензин', 'Дизель', 'Hybrid', 'LPG/LPI'],
  },
  {
    id: '10',
    name: 'Амортизатор передний',
    category: 'Подвеска',
    price: 8900,
    image: 'https://images.unsplash.com/photo-1577086664693-894d8405334a?w=600&h=450&fit=crop',
    compatibility: ['Бензин', 'Дизель', 'Hybrid', 'LPG/LPI'],
  },
  {
    id: '11',
    name: 'Топливный насос дизель',
    category: 'Топливная система',
    price: 23000,
    image: 'https://images.unsplash.com/photo-1600661653561-629509216228?w=600&h=450&fit=crop',
    compatibility: ['Дизель'],
  },
  {
    id: '12',
    name: 'Радиатор охлаждения',
    category: 'Охлаждение',
    price: 14500,
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=450&fit=crop',
    compatibility: ['Бензин', 'Дизель', 'Hybrid', 'LPG/LPI'],
  },
];

export const CATEGORIES = ['Фильтры', 'Тормозная система', 'Зажигание', 'Электроника', 'ГБО', 'Двигатель', 'Подвеска', 'Топливная система', 'Охлаждение'];