import { useMemo } from 'react';
import { STATUSES } from '../lib/constants';

export default function ChessBoard({ corpus, units, onUnitClick }) {
  const floors = useMemo(() => {
    const set = new Set(units.map((u) => u.floor));
    return Array.from(set).sort((a, b) => b - a);
  }, [units]);

  if (corpus?.isParking) {
    return (
      <div className="parking-grid">
        {units.map((u) => (
          <button
            key={u.id}
            className="parking-cell"
            style={{
              background: STATUSES[u.status].bg,
              color: STATUSES[u.status].text,
              borderColor: STATUSES[u.status].dot
            }}
            onClick={() => onUnitClick(u)}
          >
            {u.num}
          </button>
        ))}
        {units.length === 0 && (
          <p className="empty-hint">Нет машиномест, удовлетворяющих фильтру</p>
        )}
      </div>
    );
  }

  return (
    <div className="chessboard-scroll">
      <div className="chessboard">
        {floors.map((floor) => {
          const floorUnits = units
            .filter((u) => u.floor === floor)
            .sort((a, b) => a.num - b.num);
          if (floorUnits.length === 0) return null;
          return (
            <div className="chessboard-row" key={floor}>
              <div className="floor-label">{floor}</div>
              <div className="floor-cells">
                {floorUnits.map((u) => (
                  <button
                    key={u.id}
                    className="unit-cell"
                    style={{
                      background: STATUSES[u.status].bg,
                      color: STATUSES[u.status].text,
                      borderColor: STATUSES[u.status].dot
                    }}
                    onClick={() => onUnitClick(u)}
                    title={`№ ${u.num}`}
                  >
                    {u.num}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
        {floors.length === 0 && (
          <p className="empty-hint">В этом корпусе пока нет этажей. Перейдите в раздел «Структура», чтобы добавить.</p>
        )}
      </div>
    </div>
  );
}
