import { useMemo, useState } from 'react';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FIELD_CLASS, FormField, describedBy, useFieldIds } from '@/components/ui/FormField';
import { cn } from '@/utils/cn';

const ownerLabel = owner =>
  owner ? `${owner.firstName} ${owner.lastName}${owner.unitCode ? ` (${owner.unitCode})` : ''}` : '';

const matches = (owner, query) =>
  [`${owner.firstName} ${owner.lastName}`, owner.username, owner.unitCode, owner.phone].some(value =>
    String(value ?? '').toLowerCase().includes(query),
  );

/**
 * Searchable owner picker (Headless UI combobox, options render inline so they stay inside
 * the drawer's focus scope). `value` is an owner id; `onChange` receives an id or ''.
 */
export function OwnerSelect({ owners, loading, value, onChange, label, hint, error, required }) {
  const { t } = useTranslation();
  const ids = useFieldIds();
  const [query, setQuery] = useState('');
  const selected = owners.find(owner => owner.id === value) ?? null;

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle ? owners.filter(owner => matches(owner, needle)) : owners;
  }, [owners, query]);

  return (
    <FormField ids={ids} label={label} hint={hint} error={error} required={required}>
      <Combobox
        immediate
        value={selected}
        by="id"
        onChange={owner => onChange(owner?.id ?? '')}
        onClose={() => setQuery('')}
      >
        <div className="relative">
          <ComboboxInput
            id={ids.id}
            autoComplete="off"
            placeholder={t('vehicles.ownerSelect.placeholder')}
            displayValue={ownerLabel}
            onChange={event => setQuery(event.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy(ids, { error, hint })}
            className={cn(FIELD_CLASS, 'pe-10', error && 'border-danger')}
          />
          <ComboboxButton className="absolute inset-y-0 end-0 flex items-center px-3 text-faint">
            <ChevronsUpDown aria-hidden="true" className="size-4" />
          </ComboboxButton>
          <ComboboxOptions className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-line bg-surface p-1 shadow-md">
            {loading ? <p className="px-2.5 py-2 text-sm text-muted">{t('vehicles.ownerSelect.loading')}</p> : null}
            {!loading && filtered.length === 0 ? (
              <p className="px-2.5 py-2 text-sm text-muted">{t('vehicles.ownerSelect.noResults')}</p>
            ) : null}
            {filtered.map(owner => (
              <ComboboxOption
                key={owner.id}
                value={owner}
                className="group flex cursor-pointer items-center justify-between gap-2 rounded-md px-2.5 py-2 text-sm text-ink data-[focus]:bg-subtle"
              >
                <span className="min-w-0 truncate">
                  {ownerLabel(owner)}
                  <span className="ms-2 text-xs text-muted" dir="ltr">
                    @{owner.username}
                  </span>
                </span>
                <Check aria-hidden="true" className="hidden size-4 shrink-0 text-primary-ink group-data-[selected]:block" />
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </div>
      </Combobox>
    </FormField>
  );
}
