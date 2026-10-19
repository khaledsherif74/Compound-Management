import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import { CopyButton } from './CopyButton';

const PRIMITIVE_TONES = {
  string: 'text-success-fg',
  number: 'text-info-fg',
  boolean: 'text-warning-fg',
  object: 'text-muted',
};

const Primitive = ({ value }) => (
  <span className={cn('break-all', PRIMITIVE_TONES[typeof value] ?? 'text-ink')}>
    {typeof value === 'string' ? JSON.stringify(value) : String(value)}
  </span>
);

const Key = ({ name }) =>
  name === undefined ? null : <span className="text-primary-ink">{typeof name === 'number' ? name : JSON.stringify(name)}: </span>;

function Node({ name, value, depth }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(depth < 2);

  if (value === null || typeof value !== 'object') {
    return (
      <div>
        <Key name={name} />
        <Primitive value={value} />
      </div>
    );
  }

  const isArray = Array.isArray(value);
  const entries = isArray ? value.map((item, index) => [index, item]) : Object.entries(value);
  const [openBracket, closeBracket] = isArray ? ['[', ']'] : ['{', '}'];

  if (entries.length === 0) {
    return (
      <div>
        <Key name={name} />
        {openBracket}
        {closeBracket}
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(current => !current)}
        className="inline-flex items-center gap-1 rounded text-start hover:bg-line/60"
      >
        <ChevronRight aria-hidden="true" className={cn('size-3 shrink-0 transition-transform', open && 'rotate-90')} />
        <Key name={name} />
        {openBracket}
        {open ? null : (
          <span className="text-muted">
            {' '}
            {t(isArray ? 'audit.json.items' : 'audit.json.keys', { n: entries.length })} {closeBracket}
          </span>
        )}
      </button>
      {open ? (
        <>
          <div className="ms-2 border-s border-line ps-3">
            {entries.map(([key, child]) => (
              <Node key={key} name={key} value={child} depth={depth + 1} />
            ))}
          </div>
          <div className="ps-4">{closeBracket}</div>
        </>
      ) : null}
    </div>
  );
}

/** Collapsible, copyable JSON tree. Always LTR and monospaced; first two levels start open. */
export function JsonViewer({ data }) {
  return (
    <div dir="ltr" className="relative rounded-md border border-line bg-subtle p-3 pe-10 font-mono text-xs leading-relaxed text-ink">
      <div className="absolute end-1 top-1">
        <CopyButton value={JSON.stringify(data, null, 2)} label="JSON" />
      </div>
      <Node value={data} depth={0} />
    </div>
  );
}
