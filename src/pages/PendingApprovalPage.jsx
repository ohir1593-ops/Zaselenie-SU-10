import { useAuth } from '../contexts/AuthContext';

export default function PendingApprovalPage() {
  const { profile, logout } = useAuth();

  const rejected = profile?.accessStatus === 'rejected';

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-icon">{rejected ? '🚫' : '⏳'}</div>
        <h2>{rejected ? 'Доступ отклонён' : 'Ожидание одобрения'}</h2>
        <p className="auth-hint">
          {rejected
            ? 'Администратор отклонил вашу заявку на доступ. Свяжитесь с администратором системы для уточнения деталей.'
            : `Здравствуйте, ${profile?.name || ''}! Ваша заявка на доступ рассматривается администратором. Зайдите немного позже.`}
        </p>
        <button className="btn btn-secondary" onClick={logout}>
          Выйти
        </button>
      </div>
    </div>
  );
}
