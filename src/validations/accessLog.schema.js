import { z } from 'zod';
import { LOG_ACTIONS, LOG_DIRECTIONS } from '@/constants/enums';
import { msg } from './messages';

/* Mirrors backend accessLog.validation.js (createAccessLog). */
export const accessLogSchema = z.object({
  plateNumber: z.string().trim().min(1, msg('validation.required')),
  action: z.enum(Object.values(LOG_ACTIONS)),
  direction: z.enum(Object.values(LOG_DIRECTIONS)),
  reason: z.string().trim().max(255, msg('validation.maxLength', { max: 255 })),
  imagePath: z.string().trim().max(500, msg('validation.maxLength', { max: 500 })),
});
