import { z } from 'zod';
import { VEHICLE_TYPES } from '@/constants/enums';
import { DIGITS_PATTERN, PLATE_LETTERS_PATTERN } from '@/utils/plate';
import { msg } from './messages';

/* Mirrors backend vehicle.validation.js. Form values are strings. */

const required = msg('validation.required');
const max = limit => msg('validation.maxLength', { max: limit });

const plateLetters = z.string().trim().min(1, required).regex(PLATE_LETTERS_PATTERN, msg('validation.plateLetters'));
const plateNumbers = z.string().trim().min(1, required).regex(DIGITS_PATTERN, msg('validation.plateNumbers'));

const baseFields = {
  plateLetters,
  plateNumbers,
  brand: z.string().trim().max(100, max(100)),
  color: z.string().trim().max(50, max(50)),
  licenseImage: z.string().trim(),
  employeeName: z.string().trim().max(100, max(100)),
  employeePhone: z.string().trim().max(20, max(20)),
  employeeType: z.string().trim().max(50, max(50)),
};

const EMPLOYEE_FIELDS = ['employeeName', 'employeePhone', 'employeeType'];

const requireEmployeeFields = (values, ctx) =>
  EMPLOYEE_FIELDS.forEach(key => {
    if (!values[key]) ctx.addIssue({ code: z.ZodIssueCode.custom, path: [key], message: required });
  });

/**
 * Create form. Employee vehicles need the three employee fields; owner vehicles created by
 * staff (`needsOwner`) need an owner. An owner account's own vehicles need neither.
 */
export const buildCreateVehicleSchema = ({ needsOwner }) =>
  z
    .object({
      vehicleType: z.enum([VEHICLE_TYPES.OWNER, VEHICLE_TYPES.EMPLOYEE]),
      ownerId: z.string(),
      ...baseFields,
    })
    .superRefine((values, ctx) => {
      if (values.vehicleType === VEHICLE_TYPES.EMPLOYEE) requireEmployeeFields(values, ctx);
      else if (needsOwner && !values.ownerId) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['ownerId'], message: required });
      }
    });

/** Edit form (SUB_ADMIN and ADMIN). Type and owner are not editable here. */
export const buildUpdateVehicleSchema = vehicleType =>
  z.object(baseFields).superRefine((values, ctx) => {
    if (vehicleType === VEHICLE_TYPES.EMPLOYEE) requireEmployeeFields(values, ctx);
  });
