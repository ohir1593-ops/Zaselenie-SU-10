import { STATUS_ORDER, STATUSES, DEFAULT_UNIT_TYPES } from '../lib/constants';

export default function FiltersBar({ search, setSearch, filterStatus, setFilterStatus, filterType, setFilterType, unitTypes }) {
  const types = { ...DEFAULT_UNIT_TYPES, ...unitTypes };

  return (
    <div className="filters-bar">
      <input
        type="text"
        placeholder="Поиск по номеру"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="filter-search"
      />
      <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
        <option value="all">Все статусы</option>
        {STATUS_ORDER.map((s) => (
          <option key={s} value={s}>{STATUSES[s].label}</option>
        ))}
      </select>
      <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
        <option value="all">Все типы</option>
        {Object.entries(types).map(([key, t]) => (
          <option key={key} value={key}>{t.label}</option>
        ))}
      </select>
    </div>
  );
}
