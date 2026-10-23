import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from './StateViews';

// Sends signed-out visitors to /signin and remembers where they were going.
export default function ProtectedRoute({ children }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <PageLoader label="Checking your session…" />;
  if (status !== 'authenticated') return <Navigate to="/signin" replace state={{ from: location }} />;
  return children;
}
