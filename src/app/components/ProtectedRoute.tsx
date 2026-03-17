import { Navigate } from 'react-router';
import { useApp } from '../context/AppContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useApp();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
