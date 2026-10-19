import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';
import { Input } from './Input';

export const PasswordInput = forwardRef(function PasswordInput(props, ref) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;

  return (
    <Input
      ref={ref}
      {...props}
      type={visible ? 'text' : 'password'}
      endAdornment={
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={visible ? t('common.hidePassword') : t('common.showPassword')}
          aria-pressed={visible}
          onClick={() => setVisible(v => !v)}
        >
          <Icon aria-hidden="true" className="size-4" />
        </Button>
      }
    />
  );
});
