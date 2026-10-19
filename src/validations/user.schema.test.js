import { hasIssue } from '@/test/helpers';
import { buildUpdateUserSchema, createUserSchema } from './user.schema';

const owner = {
  firstName: 'Ahmed',
  lastName: 'Ali',
  username: 'ahmed',
  phone: '01001234567',
  email: 'ahmed@example.com',
  role: 'OWNER',
  unitCode: 'A-12',
  maxVehicles: '',
  password: '',
};

const staff = { ...owner, role: 'SUPERVISOR', unitCode: '', email: '', password: 'secret1' };

describe('createUserSchema', () => {
  it('accepts an owner with email and unit and no password', () => {
    expect(createUserSchema.safeParse(owner).success).toBe(true);
  });

  it('requires email and unit for owners', () => {
    const result = createUserSchema.safeParse({ ...owner, email: '', unitCode: '' });
    expect(hasIssue(result, 'email', 'validation.required')).toBe(true);
    expect(hasIssue(result, 'unitCode', 'validation.required')).toBe(true);
  });

  it('accepts staff with a password and no email', () => {
    expect(createUserSchema.safeParse(staff).success).toBe(true);
  });

  it('requires a password of at least 6 characters for non-owners', () => {
    expect(hasIssue(createUserSchema.safeParse({ ...staff, password: '' }), 'password', 'validation.required')).toBe(true);
    const short = createUserSchema.safeParse({ ...staff, password: 'abc' });
    expect(hasIssue(short, 'password', JSON.stringify({ key: 'validation.minLength', min: 6 }))).toBe(true);
  });

  it('enforces length rules like the backend Joi schema', () => {
    const result = createUserSchema.safeParse({
      ...owner,
      firstName: 'A',
      username: 'ab',
      phone: '0100',
      unitCode: 'x'.repeat(11),
    });
    expect(hasIssue(result, 'firstName', JSON.stringify({ key: 'validation.minLength', min: 2 }))).toBe(true);
    expect(hasIssue(result, 'username', JSON.stringify({ key: 'validation.minLength', min: 3 }))).toBe(true);
    expect(hasIssue(result, 'phone', JSON.stringify({ key: 'validation.exactLength', length: 11 }))).toBe(true);
    expect(hasIssue(result, 'unitCode', JSON.stringify({ key: 'validation.maxLength', max: 10 }))).toBe(true);
  });

  it('validates email format and the vehicle limit', () => {
    expect(hasIssue(createUserSchema.safeParse({ ...owner, email: 'nope' }), 'email', 'validation.email')).toBe(true);
    expect(createUserSchema.safeParse({ ...owner, maxVehicles: '3' }).success).toBe(true);
    expect(createUserSchema.safeParse({ ...owner, maxVehicles: '-1' }).success).toBe(false);
    expect(createUserSchema.safeParse({ ...owner, maxVehicles: '1.5' }).success).toBe(false);
  });

  it('rejects an unknown role', () => {
    expect(hasIssue(createUserSchema.safeParse({ ...owner, role: '' }), 'role', 'validation.required')).toBe(true);
  });
});

describe('buildUpdateUserSchema', () => {
  const base = { ...staff, password: '' };
  delete base.unitCode;

  it('keeps an email on owners', () => {
    const result = buildUpdateUserSchema('OWNER').safeParse({ ...base, role: 'OWNER', email: '' });
    expect(hasIssue(result, 'email', 'validation.required')).toBe(true);
  });

  it('makes the password optional for existing staff but checks its length when given', () => {
    const schema = buildUpdateUserSchema('SUPERVISOR');
    expect(schema.safeParse(base).success).toBe(true);
    expect(hasIssue(schema.safeParse({ ...base, password: 'abc' }), 'password', JSON.stringify({ key: 'validation.minLength', min: 6 }))).toBe(true);
  });

  it('requires a real password when a former owner becomes staff', () => {
    const result = buildUpdateUserSchema('OWNER').safeParse({ ...base, role: 'SUPERVISOR', password: '' });
    expect(hasIssue(result, 'password', 'validation.required')).toBe(true);
  });
});
