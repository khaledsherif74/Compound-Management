import { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import NotFoundPage from '@/pages/errors/NotFoundPage';
import { APP_ROUTES } from './appRoutes';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import RoleRoute from './RoleRoute';

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        element: <PublicRoute />,
        children: [{ path: ROUTES.LOGIN, element: <LoginPage /> }],
      },
      // Reachable signed in or out: the emailed link must always work.
      { path: ROUTES.RESET_PASSWORD, element: <ResetPasswordPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: APP_ROUTES.map(({ path, permission, Component }) => ({
          path,
          element: (
            <RoleRoute permission={permission}>
              <Component />
            </RoleRoute>
          ),
        })),
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
