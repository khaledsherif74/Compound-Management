import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Spinner } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';

/** For screens like login: signed-in users are sent back to where they came from. */
export default function PublicRoute() {
  const location = useLocation();
  const { isAuthenticated, isSessionReady } = useAuth();

  if (!isSessionReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-app">
        <Spinner className="size-6 text-primary" />
      </div>
    );
  }

  if (isAuthenticated) {
    const from = location.state?.from;
    const target = from ? `${from.pathname}${from.search ?? ''}` : ROUTES.DASHBOARD;
    return <Navigate to={target} replace />;
  }

  return <Outlet />;
}
