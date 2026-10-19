import { z } from 'zod';
import { GATE_DIRECTION_LIST } from '@/constants/enums';
import { msg } from './messages';

/* Mirrors backend gate.validation.js (gateName 1-50, gateCode 1-50, direction: unique In|Out, min 1). */

const text = z
  .string()
  .trim()
  .min(1, msg('validation.required'))
  .max(50, msg('validation.maxLength', { max: 50 }));

export const gateSchema = z.object({
  gateName: text,
  gateCode: text,
  direction: z.array(z.enum(GATE_DIRECTION_LIST)).min(1, msg('validation.directionMin')),
});
