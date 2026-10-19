import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { Toaster } from '@/components/ui';
import { useThemeSync } from '@/hooks/useThemeSync';
import AppRouter from '@/routes/AppRouter';
import { bootstrapSession } from '@/store/auth.slice';
import { store } from '@/store';

/** Restores the session (GET /auth/me) once, then renders the router. */
function Root() {
  const dispatch = useDispatch();
  useThemeSync();

  useEffect(() => {
    dispatch(bootstrapSession());
  }, [dispatch]);

  return (
    <>
      <AppRouter />
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
}
