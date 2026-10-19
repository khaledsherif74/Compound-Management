import * as RadixTabs from '@radix-ui/react-tabs';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';

/**
 * @param {{value: string, label: string, icon?: Function, content?: import('react').ReactNode}[]} items
 */
export function Tabs({ items, className, ...props }) {
  const { i18n } = useTranslation();
  return (
    <RadixTabs.Root dir={i18n.dir()} className={className} {...props}>
      <RadixTabs.List className="flex gap-1 overflow-x-auto border-b border-line">
        {items.map(item => (
          <RadixTabs.Trigger
            key={item.value}
            value={item.value}
            className={cn(
              '-mb-px inline-flex items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-muted transition-colors',
              'hover:text-ink data-[state=active]:border-primary data-[state=active]:text-primary-ink',
            )}
          >
            {item.icon ? <item.icon aria-hidden="true" className="size-4" /> : null}
            {item.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {items.map(item =>
        item.content === undefined ? null : (
          <RadixTabs.Content key={item.value} value={item.value} className="pt-4 outline-none">
            {item.content}
          </RadixTabs.Content>
        ),
      )}
    </RadixTabs.Root>
  );
}
