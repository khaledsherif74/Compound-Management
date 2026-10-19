import { hasIssue } from '@/test/helpers';
import { gateSchema } from './gate.schema';

const valid = { gateName: 'Main gate', gateCode: 'G-01', direction: ['In', 'Out'] };

describe('gateSchema', () => {
  it('accepts a valid gate', () => {
    expect(gateSchema.safeParse(valid).success).toBe(true);
    expect(gateSchema.safeParse({ ...valid, direction: ['Out'] }).success).toBe(true);
  });

  it('requires at least one direction', () => {
    expect(hasIssue(gateSchema.safeParse({ ...valid, direction: [] }), 'direction', 'validation.directionMin')).toBe(true);
  });

  it('only allows In and Out', () => {
    expect(gateSchema.safeParse({ ...valid, direction: ['Up'] }).success).toBe(false);
  });

  it('treats whitespace-only names and codes as empty', () => {
    const result = gateSchema.safeParse({ ...valid, gateName: '   ', gateCode: '' });
    expect(hasIssue(result, 'gateName', 'validation.required')).toBe(true);
    expect(hasIssue(result, 'gateCode', 'validation.required')).toBe(true);
  });

  it('limits name and code to 50 characters', () => {
    const result = gateSchema.safeParse({ ...valid, gateName: 'x'.repeat(51), gateCode: 'y'.repeat(51) });
    const max50 = JSON.stringify({ key: 'validation.maxLength', max: 50 });
    expect(hasIssue(result, 'gateName', max50)).toBe(true);
    expect(hasIssue(result, 'gateCode', max50)).toBe(true);
  });
});
