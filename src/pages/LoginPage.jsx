import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  function mapError(code) {
    const map = {
      'auth/invalid-email': 'Некорректный e-mail',
      'auth/user-not-found': 'Пользователь не найден',
      'auth/wrong-password': 'Неверный пароль',
      'auth/invalid-credential': 'Неверный e-mail или пароль',
      'auth/email-already-in-use': 'Этот e-mail уже зарегистрирован',
      'auth/weak-password': 'Пароль должен быть не короче 6 символов'
    };
    return map[code] || 'Произошла ошибка. Попробуйте ещё раз';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
        setRegistered(true);
      }
    } catch (err) {
      setError(mapError(err.code));
    } finally {
      setLoading(false);
    }
  }

  if (registered) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <div className="auth-icon">⏳</div>
          <h2>Заявка отправлена</h2>
          <p className="auth-hint">
            Ваш аккаунт создан и ожидает одобрения администратором.
            После подтверждения доступ к системе откроется автоматически.
          </p>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setRegistered(false);
              setMode('login');
            }}
          >
            Назад ко входу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-grid">
            <span /><span /><span />
            <span /><span /><span />
          </div>
        </div>
        <h1>Шахматка объектов</h1>
        <p className="auth-subtitle">Система учёта заселения</p>

        <div className="auth-tabs">
          <button
            className={mode === 'login' ? 'active' : ''}
            onClick={() => setMode('login')}
            type="button"
          >
            Вход
          </button>
          <button
            className={mode === 'register' ? 'active' : ''}
            onClick={() => setMode('register')}
            type="button"
          >
            Регистрация
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <input
              type="text"
              placeholder="Ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Подождите...' : mode === 'login' ? 'Войти' : 'Подать заявку на доступ'}
          </button>
        </form>

        {mode === 'register' && (
          <p className="auth-footnote">
            После регистрации администратор должен одобрить ваш доступ к системе.
          </p>
        )}
      </div>
    </div>
  );
}
