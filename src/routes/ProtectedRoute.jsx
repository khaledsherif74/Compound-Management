import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Spinner } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';

/** Waits for the session bootstrap, then lets authenticated users through. */
export default function ProtectedRoute() {
  const location = useLocation();
  const { isAuthenticated, isSessionReady } = useAuth();

  if (!isSessionReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-app">
        <Spinner className="size-6 text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
