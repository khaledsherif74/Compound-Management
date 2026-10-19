import { Toaster as HotToaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const TOAST_STYLE = {
  background: 'rgb(var(--surface))',
  color: 'rgb(var(--ink))',
  border: '1px solid rgb(var(--line))',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-md)',
  fontSize: '0.875rem',
  maxWidth: '26rem',
};

/** Mount once. Appears at the inline-end top corner; react-hot-toast announces via aria-live. */
export function Toaster() {
  const { i18n } = useTranslation();
  return (
    <HotToaster
      position={i18n.dir() === 'rtl' ? 'top-left' : 'top-right'}
      toastOptions={{
        duration: 4500,
        style: TOAST_STYLE,
        success: { iconTheme: { primary: 'rgb(var(--success))', secondary: 'rgb(var(--surface))' } },
        error: { iconTheme: { primary: 'rgb(var(--danger))', secondary: 'rgb(var(--surface))' } },
      }}
    />
  );
}
