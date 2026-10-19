import { LogIn, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui';
import { GATE_DIRECTION_LIST, GATE_DIRECTIONS } from '@/constants/enums';

const CHIPS = {
  [GATE_DIRECTIONS.IN]: { tone: 'brand', icon: LogIn },
  [GATE_DIRECTIONS.OUT]: { tone: 'info', icon: LogOut },
};

/** Chips for a gate's directions, always in In, Out order. */
export function DirectionChips({ directions = [] }) {
  const { t } = useTranslation();
  return (
    <ul className="flex flex-wrap gap-1.5">
      {GATE_DIRECTION_LIST.filter(item => directions.includes(item)).map(item => {
        const { tone, icon: Icon } = CHIPS[item];
        return (
          <li key={item}>
            <Badge tone={tone}>
              <Icon aria-hidden="true" className="size-3 rtl:-scale-x-100" />
              {t(`gates.directions.${item}`)}
            </Badge>
          </li>
        );
      })}
    </ul>
  );
}
