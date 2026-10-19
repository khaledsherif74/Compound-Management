import { hasIssue } from '@/test/helpers';
import { changePasswordSchema, loginSchema, resetPasswordSchema, resetTokenSchema } from './auth.schema';

describe('loginSchema', () => {
  it('accepts an identifier and a password', () => {
    expect(loginSchema.safeParse({ identifier: 'ahmed', password: 'x' }).success).toBe(true);
  });

  it('trims the identifier and requires both fields', () => {
    const result = loginSchema.safeParse({ identifier: '   ', password: '' });
    expect(hasIssue(result, 'identifier', 'validation.required')).toBe(true);
    expect(hasIssue(result, 'password', 'validation.required')).toBe(true);
  });
});

describe('resetTokenSchema', () => {
  it('requires exactly 64 characters', () => {
    expect(resetTokenSchema.safeParse('a'.repeat(64)).success).toBe(true);
    expect(resetTokenSchema.safeParse('a'.repeat(63)).success).toBe(false);
    expect(resetTokenSchema.safeParse('a'.repeat(65)).success).toBe(false);
  });
});

describe('resetPasswordSchema', () => {
  it('accepts matching passwords of at least 8 characters', () => {
    expect(resetPasswordSchema.safeParse({ newPassword: 'password1', confirmPassword: 'password1' }).success).toBe(true);
  });

  it('rejects short passwords', () => {
    const result = resetPasswordSchema.safeParse({ newPassword: 'short', confirmPassword: 'short' });
    expect(hasIssue(result, 'newPassword', 'validation.passwordMin')).toBe(true);
  });

  it('flags a mismatching confirmation on the confirmation field', () => {
    const result = resetPasswordSchema.safeParse({ newPassword: 'password1', confirmPassword: 'password2' });
    expect(hasIssue(result, 'confirmPassword', 'validation.passwordMatch')).toBe(true);
  });
});

describe('changePasswordSchema', () => {
  const valid = { currentPassword: 'old', newPassword: 'password1', confirmPassword: 'password1' };

  it('accepts valid input', () => {
    expect(changePasswordSchema.safeParse(valid).success).toBe(true);
  });

  it('requires the current password', () => {
    const result = changePasswordSchema.safeParse({ ...valid, currentPassword: '' });
    expect(hasIssue(result, 'currentPassword', 'validation.required')).toBe(true);
  });
});
