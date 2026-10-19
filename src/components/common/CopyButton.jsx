import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Button, Tooltip } from '@/components/ui';

export function CopyButton({ value, label }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const id = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      toast.error(t('common.copyFailed'));
    }
  };

  const Icon = copied ? Check : Copy;
  return (
    <>
      <Tooltip content={copied ? t('common.copied') : t('common.copy')}>
        <Button variant="ghost" size="icon-sm" aria-label={`${t('common.copy')}: ${label ?? value}`} onClick={copy}>
          <Icon aria-hidden="true" className="size-3.5" />
        </Button>
      </Tooltip>
      <span className="sr-only" aria-live="polite">
        {copied ? t('common.copied') : ''}
      </span>
    </>
  );
}
