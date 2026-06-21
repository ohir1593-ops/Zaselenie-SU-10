import { STATUSES } from '../lib/constants';

export default function StatusDot({ status, size = 10 }) {
  const s = STATUSES[status] || STATUSES.not_done;
  return (
    <span
      className="status-dot"
      style={{
        width: size,
        height: size,
        background: s.dot,
        border: status === 'not_done' ? '1px solid #ccc' : 'none'
      }}
    />
  );
}
