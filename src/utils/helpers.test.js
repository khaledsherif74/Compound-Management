import { parseLogFilters, isRangeInvalid, fromLocalInputValue } from './accessLogFilters';
import { auditActionTone } from './auditActions';
import { fieldError, serverMessage } from './formErrors';
import { getPasswordStrength } from './passwordStrength';
import { cleanParams, clampPagination } from './query';
import { findFieldForMessage } from './serverFieldErrors';

describe('getPasswordStrength', () => {
  it.each([
    ['', 0],
    ['abc', 1],
    ['abcdefgh', 1],
    ['12345678', 2],
    ['abcdefghijkl', 2],
    ['Abcdefg1', 3],
    ['Abcdefg1!', 4],
  ])('scores %j as %i', (password, score) => {
    expect(getPasswordStrength(password)).toBe(score);
  });
});

describe('cleanParams', () => {
  it('drops empty values but keeps 0 and false', () => {
    expect(cleanParams({ a: '', b: null, c: undefined, d: 0, e: false, f: 'x' })).toEqual({ d: 0, e: false, f: 'x' });
    expect(cleanParams()).toEqual({});
  });
});

describe('clampPagination', () => {
  it('keeps page >= 1 and limit within 1..100', () => {
    expect(clampPagination({ page: '0', limit: '500' })).toEqual({ page: 1, limit: 100 });
    expect(clampPagination({ page: '3', limit: 'abc' })).toEqual({ page: 3, limit: 20 });
    expect(clampPagination({ page: 2.7, limit: 10 })).toEqual({ page: 2, limit: 10 });
  });
});

describe('findFieldForMessage', () => {
  const fields = ['username', 'phone', 'email'];
  const hints = { username: /username/i, phone: /phone/i };

  it('uses the quoted field name from Joi messages', () => {
    expect(findFieldForMessage('"phone" length must be 11 characters long', fields)).toBe('phone');
  });

  it('falls back to hints for unquoted backend messages', () => {
    expect(findFieldForMessage('This username is already in use.', fields, hints)).toBe('username');
  });

  it('returns null when nothing matches or the field is unknown', () => {
    expect(findFieldForMessage('Something else', fields, hints)).toBeNull();
    expect(findFieldForMessage('"other" is not allowed', fields)).toBeNull();
    expect(findFieldForMessage('This phone is bad', ['email'], hints)).toBeNull();
  });
});

describe('fieldError', () => {
  const t = (key, params) => (params ? `${key}|${JSON.stringify(params)}` : key);

  it('translates plain keys, parameterized keys and raw server text', () => {
    expect(fieldError(t, { message: 'validation.required' })).toBe('validation.required');
    expect(fieldError(t, { message: JSON.stringify({ key: 'validation.minLength', min: 6 }) })).toBe(
      'validation.minLength|{"min":6}',
    );
    expect(fieldError(t, { message: serverMessage('This email: taken.') })).toBe('This email: taken.');
  });

  it('returns undefined when there is no error', () => {
    expect(fieldError(t, undefined)).toBeUndefined();
  });
});

describe('access log filters', () => {
  it('drops invalid URL values and keeps valid ones', () => {
    const uuid = '123e4567-e89b-12d3-a456-426614174000';
    expect(
      parseLogFilters({
        action: 'ENTRY',
        direction: 'SIDEWAYS',
        gateId: 'nope',
        vehicleId: uuid,
        from: '2026-01-01T00:00:00.000Z',
        to: 'garbage',
      }),
    ).toEqual({
      action: 'ENTRY',
      direction: '',
      gateId: '',
      vehicleId: uuid,
      from: '2026-01-01T00:00:00.000Z',
      to: '',
    });
  });

  it('detects an end before the start', () => {
    expect(isRangeInvalid({ from: '2026-01-02T00:00:00.000Z', to: '2026-01-01T00:00:00.000Z' })).toBe(true);
    expect(isRangeInvalid({ from: '2026-01-01T00:00:00.000Z', to: '' })).toBe(false);
  });

  it('makes the upper bound inclusive of the whole minute', () => {
    const start = Date.parse(fromLocalInputValue('2026-01-01T10:30'));
    const end = Date.parse(fromLocalInputValue('2026-01-01T10:30', true));
    expect(end - start).toBe(59999);
    expect(fromLocalInputValue('')).toBe('');
  });
});

describe('auditActionTone', () => {
  it('colors destructive and failed actions as danger', () => {
    expect(auditActionTone('USER_DELETE')).toBe('danger');
    expect(auditActionTone('LOGIN_FAILED')).toBe('danger');
    expect(auditActionTone('USER_DISABLE')).toBe('warning');
    expect(auditActionTone('VEHICLE_CREATE')).toBe('success');
    expect(auditActionTone('LOGIN')).toBe('neutral');
    expect(auditActionTone('VEHICLE_STATUS_CHANGE')).toBe('info');
  });
});
