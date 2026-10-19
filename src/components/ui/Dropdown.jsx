import * as Menu from '@radix-ui/react-dropdown-menu';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';

/**
 * Action menu. Items with `hidden: true` are dropped, so permission checks can stay inline.
 * @param {{key: string, label?: string, icon?: Function, onSelect?: Function,
 *   tone?: 'danger', checked?: boolean, disabled?: boolean, hidden?: boolean, separator?: boolean}[]} items
 */
export function Dropdown({ trigger, items, align = 'end' }) {
  const { i18n } = useTranslation();
  const visible = items.filter(item => !item.hidden);
  if (visible.length === 0) return null;

  return (
    <Menu.Root dir={i18n.dir()}>
      <Menu.Trigger asChild>{trigger}</Menu.Trigger>
      <Menu.Portal>
        <Menu.Content
          align={align}
          sideOffset={6}
          className="z-[60] min-w-44 rounded-lg border border-line bg-surface p-1 shadow-md data-[state=open]:animate-pop-in"
        >
          {visible.map(item =>
            item.separator ? (
              <Menu.Separator key={item.key} className="my-1 h-px bg-line" />
            ) : (
              <Menu.Item
                key={item.key}
                disabled={item.disabled}
                onSelect={item.onSelect}
                className={cn(
                  'flex cursor-pointer select-none items-center gap-2 rounded-md px-2.5 py-2 text-sm outline-none',
                  'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                  item.tone === 'danger'
                    ? 'text-danger data-[highlighted]:bg-danger-soft'
                    : 'text-ink data-[highlighted]:bg-subtle',
                )}
              >
                {item.icon ? <item.icon aria-hidden="true" className="size-4" /> : null}
                {item.label}
                {item.checked ? <Check aria-hidden="true" className="ms-auto size-4" /> : null}
              </Menu.Item>
            ),
          )}
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  );
}
