import { cn } from '@/utils/cn';
import { DialogShell } from './DialogShell';
import { CENTERED_PANEL_CLASS } from './dialogStyles';

const SIZES = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-3xl' };

export function Modal({ size = 'md', ...props }) {
  return <DialogShell contentClassName={cn(CENTERED_PANEL_CLASS, SIZES[size])} {...props} />;
}
