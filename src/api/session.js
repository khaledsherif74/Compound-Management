import toast from 'react-hot-toast';
import i18n from '@/config/i18n';
import { sessionExpired } from '@/store/auth.slice';
import { selectCurrentUser } from '@/store/selectors';
import { setUnauthorizedHandler } from './axiosClient';

/** Connects the axios 401 hook to the store: clears auth state and informs the user once. */
export const registerSessionHandler = store => {
  setUnauthorizedHandler(() => {
    if (!selectCurrentUser(store.getState())) return;
    store.dispatch(sessionExpired());
    toast.error(i18n.t('auth.sessionExpired'), { id: 'session-expired' });
  });
};
