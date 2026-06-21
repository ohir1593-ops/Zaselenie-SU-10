// Статусы помещений и их визуальное представление
export const STATUSES = {
  done_clean: {
    label: 'Сдано без замечаний',
    bg: '#1f4d1a',
    text: '#ffffff',
    dot: '#1f4d1a'
  },
  done_issues: {
    label: 'Сдано с замечаниями',
    bg: '#7ec850',
    text: '#1a3d10',
    dot: '#7ec850'
  },
  rejected: {
    label: 'Не принято / судебное',
    bg: '#d6453d',
    text: '#ffffff',
    dot: '#d6453d'
  },
  in_progress: {
    label: 'В работе',
    bg: '#f0c419',
    text: '#3d3000',
    dot: '#f0c419'
  },
  not_done: {
    label: 'Не сдано',
    bg: '#ffffff',
    text: '#333333',
    dot: '#cccccc'
  }
};

export const STATUS_ORDER = [
  'done_clean',
  'done_issues',
  'rejected',
  'in_progress',
  'not_done'
];

// Типы помещений. Список расширяемый — пользователь может добавлять свои через UI,
// дополнительные типы хранятся в Firestore (collection settings/unitTypes).
export const DEFAULT_UNIT_TYPES = {
  flat: { label: 'Квартира', icon: 'home' },
  apt: { label: 'Апартамент', icon: 'building' },
  parking: { label: 'Машиноместо', icon: 'car' },
  storage: { label: 'Кладовая', icon: 'box' }
};

export const ROLES = {
  admin: 'Администратор',
  user: 'Пользователь'
};

// Статусы заявки на доступ пользователя
export const ACCESS_STATUS = {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected'
};
