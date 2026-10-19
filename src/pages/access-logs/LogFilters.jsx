import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DateRangeFilter } from '@/components/common/DateRangeFilter';
import { FilterBar } from '@/components/common/FilterBar';
import { Badge, Select } from '@/components/ui';
import { LOG_ACTIONS, LOG_DIRECTIONS } from '@/constants/enums';

/** Filter controls. `filters` are validated values; `onChange` receives a partial update. */
export function LogFilters({ filters, gates, onChange, onReset }) {
  const { t } = useTranslation();
  const hasFilters = Object.values(filters).some(Boolean);

  const actionOptions = Object.values(LOG_ACTIONS).map(value => ({ value, label: t(`status.${value}`) }));
  const directionOptions = Object.values(LOG_DIRECTIONS).map(value => ({ value, label: t(`status.${value}`) }));
  const gateOptions = gates.map(gate => ({ value: gate.id, label: `${gate.gateName} (${gate.gateCode})` }));

  return (
    <FilterBar canReset={hasFilters} onReset={onReset}>
      <Select
        label={t('accessLogs.filters.action')}
        placeholder={t('accessLogs.filters.allActions')}
        value={filters.action}
        options={actionOptions}
        className="w-40"
        onChange={event => onChange({ action: event.target.value })}
      />
      <Select
        label={t('accessLogs.filters.direction')}
        placeholder={t('accessLogs.filters.allDirections')}
        value={filters.direction}
        options={directionOptions}
        className="w-44"
        onChange={event => onChange({ direction: event.target.value })}
      />
      <Select
        label={t('accessLogs.filters.gate')}
        placeholder={t('accessLogs.filters.allGates')}
        value={filters.gateId}
        options={gateOptions}
        className="w-52"
        onChange={event => onChange({ gateId: event.target.value })}
      />
      <DateRangeFilter from={filters.from} to={filters.to} onChange={onChange} />
      {filters.vehicleId ? (
        <Badge tone="brand" className="mb-1.5 h-9">
          {t('accessLogs.filters.vehicle')}
          <button
            type="button"
            aria-label={t('accessLogs.filters.removeVehicle')}
            className="rounded-full p-0.5 hover:bg-primary/15"
            onClick={() => onChange({ vehicleId: '' })}
          >
            <X aria-hidden="true" className="size-3.5" />
          </button>
        </Badge>
      ) : null}
    </FilterBar>
  );
}
