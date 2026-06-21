import { useEffect, useState } from 'react';
import { subscribeAllUsers, setUserAccessStatus, setUserRole } from '../lib/usersApi';
import { ACCESS_STATUS } from '../lib/constants';

const STATUS_LABELS = {
  pending: 'Ожидает одобрения',
  approved: 'Доступ открыт',
  rejected: 'Отклонён'
};

export default function UsersPage({ currentUid }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsub = subscribeAllUsers(setUsers);
    return unsub;
  }, []);

  const pending = users.filter((u) => u.accessStatus === ACCESS_STATUS.pending);
  const others = users.filter((u) => u.accessStatus !== ACCESS_STATUS.pending);

  return (
    <div className="users-page">
      {pending.length > 0 && (
        <section>
          <h3>Заявки на доступ ({pending.length})</h3>
          <div className="users-list">
            {pending.map((u) => (
              <div className="user-row" key={u.id}>
                <div>
                  <p className="user-name">{u.name}</p>
                  <p className="user-email">{u.email}</p>
                </div>
                <div className="user-actions">
                  <button
                    className="btn btn-small btn-primary"
                    onClick={() => setUserAccessStatus(u.id, ACCESS_STATUS.approved)}
                  >
                    Одобрить
                  </button>
                  <button
                    className="btn btn-small btn-danger-outline"
                    onClick={() => setUserAccessStatus(u.id, ACCESS_STATUS.rejected)}
                  >
                    Отклонить
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h3>Все пользователи</h3>
        <div className="users-list">
          {others.map((u) => (
            <div className="user-row" key={u.id}>
              <div>
                <p className="user-name">{u.name} {u.id === currentUid && <span className="you-badge">это вы</span>}</p>
                <p className="user-email">{u.email}</p>
                <p className="user-status-label">{STATUS_LABELS[u.accessStatus] || u.accessStatus}</p>
              </div>
              <div className="user-actions">
                <select
                  value={u.role}
                  disabled={u.id === currentUid}
                  onChange={(e) => setUserRole(u.id, e.target.value)}
                >
                  <option value="user">Пользователь</option>
                  <option value="admin">Администратор</option>
                </select>
                {u.accessStatus !== ACCESS_STATUS.approved && (
                  <button
                    className="btn btn-small btn-primary"
                    onClick={() => setUserAccessStatus(u.id, ACCESS_STATUS.approved)}
                  >
                    Открыть доступ
                  </button>
                )}
                {u.accessStatus === ACCESS_STATUS.approved && u.id !== currentUid && (
                  <button
                    className="btn btn-small btn-danger-outline"
                    onClick={() => setUserAccessStatus(u.id, ACCESS_STATUS.rejected)}
                  >
                    Закрыть доступ
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
