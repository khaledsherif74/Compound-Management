import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { createAccessLog } from '@/store/accessLogs.slice';
import { buildCreateLogPayload } from '@/utils/accessLogPayload';

/** Rejects with the backend message so the form can show it. */
export function useAccessLogActions() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const create = useCallback(
    async values => {
      await dispatch(createAccessLog(buildCreateLogPayload(values))).unwrap();
      toast.success(t('accessLogs.messages.created'));
    },
    [dispatch, t],
  );

  return { create };
}
