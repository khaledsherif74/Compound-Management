import { z } from 'zod';
import { ALL_ROLES, ROLES } from '@/constants/roles';
import { msg } from './messages';

/* Mirrors backend user.validation.js. Form values are strings; payloads are built in utils/userPayload.js. */

const required = msg('validation.required');

const name = z
  .string()
  .trim()
  .min(1, required)
  .min(2, msg('validation.minLength', { min: 2 }))
  .max(50, msg('validation.maxLength', { max: 50 }));

const username = z
  .string()
  .trim()
  .min(1, required)
  .min(3, msg('validation.minLength', { min: 3 }))
  .max(50, msg('validation.maxLength', { max: 50 }));

const phone = z
  .string()
  .trim()
  .min(1, required)
  .length(11, msg('validation.exactLength', { length: 11 }));

const optionalEmail = z
  .string()
  .trim()
  .refine(value => value === '' || z.string().email().safeParse(value).success, msg('validation.email'));

const unitCode = z.string().trim().max(10, msg('validation.maxLength', { max: 10 }));

const maxVehicles = z
  .string()
  .trim()
  .refine(value => value === '' || /^\d+$/.test(value), msg('validation.intMin', { min: 0 }));

const role = z.enum(ALL_ROLES, { errorMap: () => ({ message: required }) });

const issue = (ctx, path, message) => ctx.addIssue({ code: z.ZodIssueCode.custom, path: [path], message });

const checkPassword = (ctx, password) => {
  if (!password) issue(ctx, 'password', required);
  else if (password.length < 6) issue(ctx, 'password', msg('validation.minLength', { min: 6 }));
};

/** Owner: email + unitCode required, no password. Other roles: password (min 6) required. */
export const createUserSchema = z
  .object({
    firstName: name,
    lastName: name,
    username,
    phone,
    email: optionalEmail,
    role,
    unitCode,
    maxVehicles,
    password: z.string(),
  })
  .superRefine((values, ctx) => {
    if (values.role === ROLES.OWNER) {
      if (!values.email) issue(ctx, 'email', required);
      if (!values.unitCode) issue(ctx, 'unitCode', required);
    } else {
      checkPassword(ctx, values.password);
    }
  });

/**
 * Edit form. unitCode is not editable (backend PATCH rejects it).
 * Owner keeps an email. A former owner must get a real password. Owner password is never sent.
 * @param {string} originalRole role of the user being edited
 */
export const buildUpdateUserSchema = originalRole =>
  z
    .object({
      firstName: name,
      lastName: name,
      username,
      phone,
      email: optionalEmail,
      role,
      maxVehicles,
      password: z.string(),
    })
    .superRefine((values, ctx) => {
      if (values.role === ROLES.OWNER) {
        if (!values.email) issue(ctx, 'email', required);
        return;
      }
      const mustSetPassword = originalRole === ROLES.OWNER;
      if (mustSetPassword || values.password) checkPassword(ctx, values.password);
    });
