import * as RadixTooltip from '@radix-ui/react-tooltip';

/** Wraps a single focusable child. Renders the child untouched when there is no content. */
export function Tooltip({ content, side = 'top', children }) {
  if (!content) return children;
  return (
    <RadixTooltip.Provider delayDuration={250}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            sideOffset={6}
            className="z-[60] max-w-xs rounded-md bg-ink px-2.5 py-1.5 text-xs text-app shadow-md data-[state=delayed-open]:animate-fade-in"
          >
            {content}
            <RadixTooltip.Arrow className="fill-ink" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
