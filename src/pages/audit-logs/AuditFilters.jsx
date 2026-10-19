import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DateRangeFilter } from '@/components/common/DateRangeFilter';
import { FilterBar } from '@/components/common/FilterBar';
import { Badge, Select } from '@/components/ui';
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from '@/constants/enums';

/** `userName` is the actor's name when known (taken from loaded rows), for the user chip. */
export function AuditFilters({ filters, userName, onChange, onReset }) {
  const { t } = useTranslation();
  const hasFilters = Object.values(filters).some(Boolean);

  const actionOptions = AUDIT_ACTIONS.map(value => ({
    value,
    label: t(`audit.actions.${value}`, { defaultValue: value }),
  }));
  const entityOptions = AUDIT_ENTITIES.map(value => ({ value, label: t(`audit.entities.${value}`) }));

  return (
    <FilterBar canReset={hasFilters} onReset={onReset}>
      <Select
        label={t('audit.filters.action')}
        placeholder={t('audit.filters.allActions')}
        value={filters.action}
        options={actionOptions}
        className="w-56"
        onChange={event => onChange({ action: event.target.value })}
      />
      <Select
        label={t('audit.filters.entity')}
        placeholder={t('audit.filters.allEntities')}
        value={filters.entity}
        options={entityOptions}
        className="w-44"
        onChange={event => onChange({ entity: event.target.value })}
      />
      <DateRangeFilter from={filters.from} to={filters.to} onChange={onChange} />
      {filters.userId ? (
        <Badge tone="brand" className="mb-1.5 h-9">
          {userName ? t('audit.filters.userNamed', { name: userName }) : t('audit.filters.user')}
          <button
            type="button"
            aria-label={t('audit.filters.removeUser')}
            className="rounded-full p-0.5 hover:bg-primary/15"
            onClick={() => onChange({ userId: '' })}
          >
            <X aria-hidden="true" className="size-3.5" />
          </button>
        </Badge>
      ) : null}
    </FilterBar>
  );
}
