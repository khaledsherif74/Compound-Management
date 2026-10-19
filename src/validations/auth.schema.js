import { z } from 'zod';

/* Messages are i18n keys; forms translate them with fieldError(t, error). */
const required = z.string().trim().min(1, 'validation.required');
const newPassword = z.string().min(8, 'validation.passwordMin');

/** Mirrors backend auth.validation.js: login. */
export const loginSchema = z.object({
  identifier: required,
  password: z.string().min(1, 'validation.required'),
});

/** Backend: token is exactly 64 characters. */
export const resetTokenSchema = z.string().length(64);

const withConfirmation = shape =>
  z.object(shape).refine(values => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'validation.passwordMatch',
  });

export const resetPasswordSchema = withConfirmation({
  newPassword,
  confirmPassword: z.string().min(1, 'validation.required'),
});

/** Backend: PATCH /auth/password. */
export const changePasswordSchema = withConfirmation({
  currentPassword: z.string().min(1, 'validation.required'),
  newPassword,
  confirmPassword: z.string().min(1, 'validation.required'),
});
