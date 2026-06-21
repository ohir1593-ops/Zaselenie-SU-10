import { STATUS_ORDER, STATUSES } from '../lib/constants';
import StatusDot from './StatusDot';

function countByStatus(units) {
  const counts = {};
  STATUS_ORDER.forEach((s) => (counts[s] = 0));
  units.forEach((u) => {
    if (counts[u.status] !== undefined) counts[u.status]++;
  });
  return counts;
}

export default function CorpusStatsBlock({ title, units }) {
  const counts = countByStatus(units);
  const total = units.length;

  return (
    <div className="stats-grid">
      <div className="stat-card stat-card-total">
        <p className="stat-label">{title || 'Всего'}</p>
        <p className="stat-value">{total}</p>
      </div>
      {STATUS_ORDER.map((s) => (
        <div className="stat-card" key={s}>
          <p className="stat-label">
            <StatusDot status={s} size={8} /> {STATUSES[s].label}
          </p>
          <p className="stat-value">{counts[s]}</p>
        </div>
      ))}
    </div>
  );
}

export { countByStatus };
