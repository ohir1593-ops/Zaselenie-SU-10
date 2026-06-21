import { STATUS_ORDER, STATUSES, DEFAULT_UNIT_TYPES } from '../lib/constants';
import StatusDot from '../components/StatusDot';
import { countByStatus } from '../components/CorpusStatsBlock';

export default function StatsPage({ corpuses, units, unitTypes }) {
  const types = { ...DEFAULT_UNIT_TYPES, ...unitTypes };

  const corpusRows = corpuses.map((c) => {
    const us = units.filter((u) => u.corpusId === c.id);
    return { corpus: c, counts: countByStatus(us), total: us.length };
  });

  const grandCounts = countByStatus(units);
  const grandTotal = units.length;

  const typeRows = Object.entries(types)
    .map(([key, t]) => {
      const us = units.filter((u) => u.type === key);
      return { key, label: t.label, counts: countByStatus(us), total: us.length };
    })
    .filter((r) => r.total > 0);

  return (
    <div className="stats-page">
      <section>
        <h3>Сводка по корпусам</h3>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Корпус</th>
                <th className="num">Всего</th>
                {STATUS_ORDER.map((s) => (
                  <th key={s} className="num"><StatusDot status={s} size={8} /> {STATUSES[s].label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {corpusRows.map((r) => (
                <tr key={r.corpus.id}>
                  <td>{r.corpus.name}</td>
                  <td className="num bold">{r.total}</td>
                  {STATUS_ORDER.map((s) => (
                    <td key={s} className="num">{r.counts[s]}</td>
                  ))}
                </tr>
              ))}
              <tr className="total-row">
                <td>Итого</td>
                <td className="num bold">{grandTotal}</td>
                {STATUS_ORDER.map((s) => (
                  <td key={s} className="num bold">{grandCounts[s]}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3>Сводка по типам помещений</h3>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Тип</th>
                <th className="num">Всего</th>
                {STATUS_ORDER.map((s) => (
                  <th key={s} className="num"><StatusDot status={s} size={8} /> {STATUSES[s].label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {typeRows.map((r) => (
                <tr key={r.key}>
                  <td>{r.label}</td>
                  <td className="num bold">{r.total}</td>
                  {STATUS_ORDER.map((s) => (
                    <td key={s} className="num">{r.counts[s]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
