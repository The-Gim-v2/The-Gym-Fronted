export interface CategoryItem {
  key: string;
  color: string;
  es: string;
  en: string;
}

export interface CategoryGroup {
  key: string;
  es: string;
  en: string;
  items: CategoryItem[];
}

export const categoryGroups: CategoryGroup[] = [
  {
    key: 'mindBody',
    es: 'Mente y cuerpo',
    en: 'Mind & body',
    items: [
      { key: 'yoga', color: '#a855f7', es: 'Yoga', en: 'Yoga' },
      { key: 'pilates', color: '#14b8a6', es: 'Pilates', en: 'Pilates' },
      { key: 'stretching', color: '#38bdf8', es: 'Estiramiento', en: 'Stretching' },
      { key: 'meditation', color: '#c4b5fd', es: 'Meditación', en: 'Meditation' },
      { key: 'barre', color: '#f9a8d4', es: 'Barre', en: 'Barre' }
    ]
  },
  {
    key: 'cardio',
    es: 'Cardio y resistencia',
    en: 'Cardio & endurance',
    items: [
      { key: 'spinning', color: '#f97316', es: 'Spinning', en: 'Spinning' },
      { key: 'cardio', color: '#10b981', es: 'Cardio', en: 'Cardio' },
      { key: 'aerobics', color: '#a3e635', es: 'Aeróbicos', en: 'Aerobics' },
      { key: 'hiit', color: '#fb7185', es: 'HIIT', en: 'HIIT' },
      { key: 'swimming', color: '#06b6d4', es: 'Natación', en: 'Swimming' }
    ]
  },
  {
    key: 'strength',
    es: 'Fuerza y acondicionamiento',
    en: 'Strength & conditioning',
    items: [
      { key: 'crossfit', color: '#ef4444', es: 'CrossFit', en: 'CrossFit' },
      { key: 'functional', color: '#3b82f6', es: 'Entrenamiento funcional', en: 'Functional training' },
      { key: 'trx', color: '#6366f1', es: 'TRX', en: 'TRX' },
      { key: 'weights', color: '#b45309', es: 'Pesas guiadas', en: 'Guided weights' },
      { key: 'calisthenics', color: '#65a30d', es: 'Calistenia', en: 'Calisthenics' },
      { key: 'gap', color: '#e879f9', es: 'GAP (glúteos, abdomen, piernas)', en: 'GAP (glutes, abs, legs)' },
      { key: 'personal', color: '#94a3b8', es: 'Entrenamiento personal', en: 'Personal training' }
    ]
  },
  {
    key: 'combat',
    es: 'Combate',
    en: 'Combat',
    items: [
      { key: 'boxing', color: '#eab308', es: 'Boxeo', en: 'Boxing' },
      { key: 'kickboxing', color: '#be123c', es: 'Kickboxing', en: 'Kickboxing' },
      { key: 'martial', color: '#a8a29e', es: 'Artes marciales', en: 'Martial arts' }
    ]
  },
  {
    key: 'dance',
    es: 'Baile',
    en: 'Dance',
    items: [
      { key: 'zumba', color: '#ec4899', es: 'Zumba', en: 'Zumba' },
      { key: 'dance', color: '#d946ef', es: 'Baile / Danza', en: 'Dance' }
    ]
  }
];

const flat: CategoryItem[] = categoryGroups.flatMap(group => group.items);

export const categoryKeys: string[] = flat.map(item => item.key);

const normalize = (value: string): string =>
  (value || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

export const findCategory = (value: string): CategoryItem | undefined => {
  const needle = normalize(value);

  if (!needle) return undefined;

  return flat.find(
    item =>
      item.key === needle ||
      normalize(item.es) === needle ||
      normalize(item.en) === needle
  );
};

export const categoryKey = (value: string): string =>
  findCategory(value)?.key || value || '';

export const categoryColor = (value: string): string =>
  findCategory(value)?.color || '';

export const categoryLabel = (
  value: string,
  lang: string = 'es'
): string => {
  const item = findCategory(value);

  if (!item) return value || '';

  return String(lang).toLowerCase().startsWith('en')
    ? item.en
    : item.es;
};