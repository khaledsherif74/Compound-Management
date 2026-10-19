import { hasIssue, schemaIssues } from '@/test/helpers';
import { buildCreateVehicleSchema, buildUpdateVehicleSchema } from './vehicle.schema';

const base = {
  vehicleType: 'OWNER',
  ownerId: '123e4567-e89b-12d3-a456-426614174000',
  plateLetters: 'ع س ل',
  plateNumbers: '444',
  brand: '',
  color: '',
  licenseImage: '',
  employeeName: '',
  employeePhone: '',
  employeeType: '',
};

describe('buildCreateVehicleSchema', () => {
  const staffSchema = buildCreateVehicleSchema({ needsOwner: true });
  const ownerSchema = buildCreateVehicleSchema({ needsOwner: false });

  it('accepts an owner vehicle with an owner chosen by staff', () => {
    expect(staffSchema.safeParse(base).success).toBe(true);
  });

  it('requires an owner when staff create an owner vehicle, but not for an owner account', () => {
    expect(hasIssue(staffSchema.safeParse({ ...base, ownerId: '' }), 'ownerId', 'validation.required')).toBe(true);
    expect(ownerSchema.safeParse({ ...base, ownerId: '' }).success).toBe(true);
  });

  it('requires the three employee fields for employee vehicles', () => {
    const result = staffSchema.safeParse({ ...base, vehicleType: 'EMPLOYEE', ownerId: '' });
    ['employeeName', 'employeePhone', 'employeeType'].forEach(path => {
      expect(hasIssue(result, path, 'validation.required')).toBe(true);
    });
    expect(schemaIssues(result).some(issue => issue.path === 'ownerId')).toBe(false);
  });

  it('accepts a complete employee vehicle', () => {
    const result = staffSchema.safeParse({
      ...base,
      vehicleType: 'EMPLOYEE',
      ownerId: '',
      employeeName: 'Sam',
      employeePhone: '01000000000',
      employeeType: 'Driver',
    });
    expect(result.success).toBe(true);
  });

  it('validates plate letters and numbers like the backend patterns', () => {
    const bad = staffSchema.safeParse({ ...base, plateLetters: 'abc', plateNumbers: '12a' });
    expect(hasIssue(bad, 'plateLetters', 'validation.plateLetters')).toBe(true);
    expect(hasIssue(bad, 'plateNumbers', 'validation.plateNumbers')).toBe(true);
    expect(staffSchema.safeParse({ ...base, plateNumbers: '٤٤٤' }).success).toBe(true);
  });

  it('reports a required error first for empty plate fields', () => {
    const result = staffSchema.safeParse({ ...base, plateLetters: '', plateNumbers: '' });
    expect(schemaIssues(result).find(issue => issue.path === 'plateLetters').message).toBe('validation.required');
    expect(schemaIssues(result).find(issue => issue.path === 'plateNumbers').message).toBe('validation.required');
  });

  it('limits brand to 100 and color to 50 characters', () => {
    const result = staffSchema.safeParse({ ...base, brand: 'x'.repeat(101), color: 'y'.repeat(51) });
    expect(hasIssue(result, 'brand', JSON.stringify({ key: 'validation.maxLength', max: 100 }))).toBe(true);
    expect(hasIssue(result, 'color', JSON.stringify({ key: 'validation.maxLength', max: 50 }))).toBe(true);
  });
});

describe('buildUpdateVehicleSchema', () => {
  const { vehicleType: _type, ownerId: _owner, ...fields } = base;

  it('does not require employee fields for owner vehicles', () => {
    expect(buildUpdateVehicleSchema('OWNER').safeParse(fields).success).toBe(true);
  });

  it('requires them for employee vehicles', () => {
    const result = buildUpdateVehicleSchema('EMPLOYEE').safeParse(fields);
    expect(hasIssue(result, 'employeeName', 'validation.required')).toBe(true);
  });
});
