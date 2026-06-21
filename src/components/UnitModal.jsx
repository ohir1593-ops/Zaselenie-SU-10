import { useState, useEffect } from 'react';
import { STATUS_ORDER, STATUSES, DEFAULT_UNIT_TYPES } from '../lib/constants';
import StatusDot from './StatusDot';

export default function UnitModal({ unit, corpusName, isAdmin, unitTypes, onClose, onUpdate, onDelete }) {
  const [comment, setComment] = useState(unit.comment || '');

  useEffect(() => {
    setComment(unit.comment || '');
  }, [unit.id]);

  if (!unit) return null;

  const types = { ...DEFAULT_UNIT_TYPES, ...unitTypes };
  const typeLabel = types[unit.type]?.label || unit.type;

  function handleStatusClick(status) {
    onUpdate(unit.id, { status });
  }

  function handleCommentBlur() {
    if (comment !== unit.comment) {
      onUpdate(unit.id, { comment });
    }
  }

  function handleDelete() {
    if (window.confirm(`Удалить помещение № ${unit.num}? Это действие необратимо.`)) {
      onDelete(unit.id);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>{typeLabel} № {unit.num}</h3>
            <p className="modal-subtitle">
              {corpusName}{unit.floor && unit.floor !== '-' ? `, этаж ${unit.floor}` : ''}
            </p>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Закрыть">✕</button>
        </div>

        <p className="modal-section-label">Статус</p>
        <div className="status-list">
          {STATUS_ORDER.map((s) => (
            <button
              key={s}
              className={`status-option ${unit.status === s ? 'active' : ''}`}
              onClick={() => handleStatusClick(s)}
            >
              <StatusDot status={s} />
              {STATUSES[s].label}
            </button>
          ))}
        </div>

        <p className="modal-section-label">Комментарий</p>
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onBlur={handleCommentBlur}
          placeholder="Например: ожидание справки от собственника"
        />

        {isAdmin && (
          <button className="btn btn-danger-outline" onClick={handleDelete}>
            Удалить помещение
          </button>
        )}
      </div>
    </div>
  );
}
