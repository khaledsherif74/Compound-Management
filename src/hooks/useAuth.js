import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '@/store/auth.slice';
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectIsSessionReady,
  selectUserRole,
} from '@/store/selectors';

/** `signIn` rejects with the backend message string, ready to show in the form. */
export function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const role = useSelector(selectUserRole);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isSessionReady = useSelector(selectIsSessionReady);

  const signIn = useCallback(credentials => dispatch(login(credentials)).unwrap(), [dispatch]);
  const signOut = useCallback(() => dispatch(logout()), [dispatch]);

  return { user, role, isAuthenticated, isSessionReady, signIn, signOut };
}
