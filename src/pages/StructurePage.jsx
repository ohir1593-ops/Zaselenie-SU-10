import { useState } from 'react';
import { DEFAULT_UNIT_TYPES } from '../lib/constants';

export default function StructurePage({
  corpuses,
  units,
  unitTypes,
  onAddCorpus,
  onRenameCorpus,
  onDeleteCorpus,
  onAddFloor,
  onDeleteFloor,
  onAddUnit,
  onDeleteUnit
}) {
  const [newCorpusName, setNewCorpusName] = useState('');
  const [addingUnitTo, setAddingUnitTo] = useState(null); // {corpusId, floor}
  const [newUnitNum, setNewUnitNum] = useState('');
  const [newUnitType, setNewUnitType] = useState('flat');

  const types = { ...DEFAULT_UNIT_TYPES, ...unitTypes };

  function handleAddCorpus() {
    const name = newCorpusName.trim() || `Корпус ${corpuses.filter((c) => !c.isParking).length + 1}`;
    onAddCorpus(name);
    setNewCorpusName('');
  }

  function handleConfirmAddUnit() {
    if (!newUnitNum.trim()) return;
    onAddUnit(addingUnitTo.corpusId, addingUnitTo.floor, newUnitNum.trim(), newUnitType);
    setAddingUnitTo(null);
    setNewUnitNum('');
    setNewUnitType('flat');
  }

  return (
    <div className="structure-page">
      <div className="structure-header">
        <h3>Структура объекта</h3>
        <div className="add-corpus-row">
          <input
            type="text"
            placeholder="Название корпуса"
            value={newCorpusName}
            onChange={(e) => setNewCorpusName(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleAddCorpus}>+ Добавить корпус</button>
        </div>
      </div>

      {corpuses.map((c) => {
        const corpusUnits = units.filter((u) => u.corpusId === c.id);
        const floors = Array.from(new Set(corpusUnits.map((u) => u.floor))).sort((a, b) => b - a);

        return (
          <div className="structure-corpus-card" key={c.id}>
            <div className="structure-corpus-header">
              <input
                className="corpus-name-input"
                value={c.name}
                onChange={(e) => onRenameCorpus(c.id, e.target.value)}
              />
              <div className="structure-corpus-actions">
                {!c.isParking && (
                  <button
                    className="btn btn-small"
                    onClick={() => onAddFloor(c.id)}
                  >
                    + Этаж
                  </button>
                )}
                <button
                  className="btn btn-small btn-danger-outline"
                  onClick={() => {
                    if (window.confirm(`Удалить «${c.name}» и все его помещения?`)) onDeleteCorpus(c.id);
                  }}
                >
                  Удалить корпус
                </button>
              </div>
            </div>

            {c.isParking ? (
              <div className="structure-parking-row">
                <span>Машиномест: {corpusUnits.length}</span>
                <button
                  className="btn btn-small"
                  onClick={() => setAddingUnitTo({ corpusId: c.id, floor: '-' })}
                >
                  + Машиноместо
                </button>
              </div>
            ) : (
              <div className="structure-floors">
                {floors.length === 0 && <p className="empty-hint-small">Этажей пока нет</p>}
                {floors.map((f) => {
                  const floorUnits = corpusUnits.filter((u) => u.floor === f);
                  return (
                    <div className="structure-floor-row" key={f}>
                      <span className="structure-floor-label">Этаж {f}</span>
                      <span className="structure-floor-count">{floorUnits.length} помещ.</span>
                      <button
                        className="btn btn-small"
                        onClick={() => setAddingUnitTo({ corpusId: c.id, floor: f })}
                      >
                        + помещение
                      </button>
                      <button
                        className="btn btn-small btn-danger-outline"
                        onClick={() => {
                          if (window.confirm(`Удалить этаж ${f} и все его помещения?`)) onDeleteFloor(c.id, f);
                        }}
                      >
                        удалить этаж
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {addingUnitTo && (
        <div className="modal-overlay" onClick={() => setAddingUnitTo(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Новое помещение</h3>
              <button className="icon-btn" onClick={() => setAddingUnitTo(null)}>✕</button>
            </div>
            <p className="modal-section-label">Номер</p>
            <input
              type="text"
              value={newUnitNum}
              onChange={(e) => setNewUnitNum(e.target.value)}
              placeholder="Например: 105"
              autoFocus
            />
            <p className="modal-section-label">Тип</p>
            <select value={newUnitType} onChange={(e) => setNewUnitType(e.target.value)}>
              {Object.entries(types).map(([key, t]) => (
                <option key={key} value={key}>{t.label}</option>
              ))}
            </select>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={handleConfirmAddUnit}>
              Добавить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
