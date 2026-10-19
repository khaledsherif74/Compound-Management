import { ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DateTime } from '@/components/common/DateTime';
import { RawPlate } from '@/components/common/RawPlate';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button, Table, TableSkeleton, TBody, Td, Th, THead, Tooltip, Tr } from '@/components/ui';

const ROW_TONES = { ENTRY: 'success', EXIT: 'info', DENIED: 'danger' };
const STAFF_COLUMNS = ['time', 'plate', 'vehicle', 'owner', 'gate', 'direction', 'action', 'reason', 'image'];
const OWNER_COLUMNS = ['time', 'plate', 'gate', 'direction', 'action', 'reason', 'image'];

const rowKey = (log, index) => `${log.timestamp}-${log.plateNumber}-${index}`;

function Cell({ column, log, onViewImage }) {
  const { t } = useTranslation();
  switch (column) {
    case 'time':
      return (
        <Td className="whitespace-nowrap">
          <DateTime value={log.timestamp} withSeconds />
        </Td>
      );
    case 'plate':
      return (
        <Td>
          <RawPlate value={log.plateNumber} />
        </Td>
      );
    case 'vehicle':
      return <Td>{[log.brand, log.color].filter(Boolean).join(' · ') || t('common.none')}</Td>;
    case 'owner':
      return (
        <Td>
          {log.owner ? (
            <>
              <p>{log.owner}</p>
              {log.unit ? <p className="text-xs text-muted">{t('accessLogs.unit', { unit: log.unit })}</p> : null}
            </>
          ) : (
            t('common.none')
          )}
        </Td>
      );
    case 'gate':
      return (
        <Td className="font-mono text-xs" dir="ltr">
          {log.gate || t('common.none')}
        </Td>
      );
    case 'direction':
      return (
        <Td>
          <StatusBadge kind="direction" value={log.direction} />
        </Td>
      );
    case 'action':
      return (
        <Td>
          <StatusBadge kind="log" value={log.action} />
        </Td>
      );
    case 'reason':
      return <Td className="max-w-xs text-muted">{log.reason || t('common.none')}</Td>;
    default:
      return (
        <Td className="w-12">
          {log.imagePath ? (
            <Tooltip content={t('accessLogs.viewImage')}>
              <Button variant="ghost" size="icon-sm" aria-label={t('accessLogs.viewImage')} onClick={() => onViewImage(log)}>
                <ImageIcon aria-hidden="true" className="size-4" />
              </Button>
            </Tooltip>
          ) : null}
        </Td>
      );
  }
}

/** Color-coded log rows: entry green, exit blue, denied red. */
export function AccessLogsTable({ logs, loading, ownerView, onViewImage }) {
  const { t } = useTranslation();
  const columns = ownerView ? OWNER_COLUMNS : STAFF_COLUMNS;
  const showSkeleton = loading && logs.length === 0;

  return (
    <Table aria-busy={loading} className={loading && !showSkeleton ? 'opacity-70 transition-opacity' : undefined}>
      <THead>
        <tr>
          {columns.map(column => (
            <Th key={column}>{column === 'image' ? <span className="sr-only">{t('accessLogs.columns.image')}</span> : t(`accessLogs.columns.${column}`)}</Th>
          ))}
        </tr>
      </THead>
      <TBody>
        {showSkeleton ? (
          <TableSkeleton rows={8} columns={columns.length} />
        ) : (
          logs.map((log, index) => (
            <Tr key={rowKey(log, index)} tone={ROW_TONES[log.action]}>
              {columns.map(column => (
                <Cell key={column} column={column} log={log} onViewImage={onViewImage} />
              ))}
            </Tr>
          ))
        )}
      </TBody>
    </Table>
  );
}
