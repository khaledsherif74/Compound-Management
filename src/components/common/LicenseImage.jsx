import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const isHttpUrl = value => /^https?:\/\//i.test(value ?? '');

/** Previews the license image when it is an http(s) link; otherwise shows the raw text. */
export function LicenseImage({ src, alt }) {
  const { t } = useTranslation();
  const [failed, setFailed] = useState(false);

  if (!src) return <p className="text-sm text-muted">{t('vehicles.detail.noImage')}</p>;
  if (!isHttpUrl(src)) return <p className="break-all text-sm text-ink">{src}</p>;

  if (failed) {
    return (
      <p className="text-sm text-muted">
        {t('vehicles.detail.imageFailed')}{' '}
        <a href={src} target="_blank" rel="noopener noreferrer" className="text-primary-ink underline">
          {t('vehicles.detail.openImage')}
        </a>
      </p>
    );
  }

  return (
    <a href={src} target="_blank" rel="noopener noreferrer" aria-label={t('vehicles.detail.openImage')}>
      <img
        src={src}
        alt={alt ?? t('vehicles.fields.licenseImage')}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="max-h-56 w-full rounded-md border border-line bg-subtle object-contain"
      />
    </a>
  );
}
