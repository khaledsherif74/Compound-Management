import toast from 'react-hot-toast';
import { TriangleAlert } from 'lucide-react';

/** Warning toast with one action button (e.g. "Resend"). Stays longer than a normal toast. */
export const notifyWithAction = ({ message, actionLabel, onAction }) =>
  toast(
    current => (
      <div className="flex items-center gap-3">
        <span>{message}</span>
        <button
          type="button"
          className="shrink-0 rounded px-2 py-1 text-sm font-medium text-primary-ink hover:bg-subtle"
          onClick={() => {
            toast.dismiss(current.id);
            onAction();
          }}
        >
          {actionLabel}
        </button>
      </div>
    ),
    { icon: <TriangleAlert aria-hidden="true" className="size-5 text-warning" />, duration: 10000 },
  );
