import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import PendingApprovalPage from './pages/PendingApprovalPage';
import Dashboard from './pages/Dashboard';
import './styles.css';

function Router() {
  const { firebaseUser, loading, isApproved, profile } = useAuth();

  if (loading) {
    return <div className="loading-screen">Загрузка…</div>;
  }

  if (!firebaseUser) {
    return <LoginPage />;
  }

  if (!profile || !isApproved) {
    return <PendingApprovalPage />;
  }

  return <Dashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}
