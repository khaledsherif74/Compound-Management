import { cn } from '@/utils/cn';

const TONES = [
  'bg-primary-soft text-primary-ink',
  'bg-accent-soft text-accent-ink',
  'bg-info-soft text-info-fg',
  'bg-warning-soft text-warning-fg',
  'bg-success-soft text-success-fg',
];

const SIZES = { sm: 'size-7 text-xs', md: 'size-9 text-sm', lg: 'size-14 text-lg' };

const firstChar = value => Array.from(value ?? '')[0] ?? '';

/** Stable tone per user so the same person always gets the same color. */
const toneFor = seed => {
  const hash = Array.from(seed ?? '').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return TONES[hash % TONES.length];
};

export function UserAvatar({ user, size = 'md', className }) {
  const initials = `${firstChar(user?.firstName)}${firstChar(user?.lastName)}`.toUpperCase();
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold',
        toneFor(user?.id ?? user?.username),
        SIZES[size],
        className,
      )}
    >
      {initials || '?'}
    </span>
  );
}
