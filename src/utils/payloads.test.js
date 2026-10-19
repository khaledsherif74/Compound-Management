import { buildUpdateGatePayload, buildCreateGatePayload } from './gatePayload';
import { buildCreatePayload, buildUpdatePayload } from './userPayload';
import { buildCreateVehiclePayload, buildUpdateVehiclePayload } from './vehiclePayload';

describe('user payloads', () => {
  const ownerValues = {
    firstName: ' Ahmed ',
    lastName: 'Ali',
    username: 'ahmed',
    phone: '01001234567',
    email: ' a@b.com ',
    role: 'OWNER',
    unitCode: ' A-12 ',
    maxVehicles: '3',
    password: 'ignored1',
  };

  it('never sends a password for owners and trims text', () => {
    expect(buildCreatePayload(ownerValues)).toEqual({
      firstName: 'Ahmed',
      lastName: 'Ali',
      username: 'ahmed',
      phone: '01001234567',
      role: 'OWNER',
      email: 'a@b.com',
      unitCode: 'A-12',
      maxVehicles: 3,
    });
  });

  it('omits an empty vehicle limit so the backend default applies', () => {
    expect(buildCreatePayload({ ...ownerValues, maxVehicles: '' })).not.toHaveProperty('maxVehicles');
  });

  it('sends a password and no unit for non-owners', () => {
    const payload = buildCreatePayload({ ...ownerValues, role: 'SUPERVISOR', email: '', password: 'secret1' });
    expect(payload.password).toBe('secret1');
    expect(payload).not.toHaveProperty('unitCode');
    expect(payload).not.toHaveProperty('maxVehicles');
    expect(payload).not.toHaveProperty('email');
  });

  describe('update', () => {
    const original = {
      firstName: 'Ahmed',
      lastName: 'Ali',
      username: 'ahmed',
      phone: '01001234567',
      email: 'a@b.com',
      role: 'OWNER',
      maxVehicles: null,
    };
    const same = { ...original, maxVehicles: '', password: '' };

    it('sends nothing when nothing changed', () => {
      expect(buildUpdatePayload(same, original)).toEqual({});
    });

    it('sends only changed fields', () => {
      expect(buildUpdatePayload({ ...same, firstName: ' Omar ' }, original)).toEqual({ firstName: 'Omar' });
      expect(buildUpdatePayload({ ...same, maxVehicles: '5' }, original)).toEqual({ maxVehicles: 5 });
    });

    it('sends null when an email is cleared', () => {
      const staff = { ...original, role: 'SUPERVISOR' };
      expect(buildUpdatePayload({ ...staff, maxVehicles: '', password: '', email: '' }, staff)).toEqual({ email: null });
    });

    it('never sends a password when the resulting role is owner', () => {
      const staff = { ...original, role: 'SUPERVISOR', email: null };
      const payload = buildUpdatePayload({ ...same, role: 'OWNER', email: 'x@y.com', password: 'newpass1' }, staff);
      expect(payload).toEqual({ role: 'OWNER', email: 'x@y.com' });
    });

    it('sends a new password for non-owners', () => {
      const staff = { ...original, role: 'SUPERVISOR' };
      expect(buildUpdatePayload({ ...staff, maxVehicles: '', password: 'newpass1' }, staff)).toEqual({ password: 'newpass1' });
    });
  });
});

describe('vehicle payloads', () => {
  const values = {
    vehicleType: 'OWNER',
    ownerId: 'owner-1',
    plateLetters: ' ع س ل ',
    plateNumbers: '444',
    brand: ' Hyundai ',
    color: '',
    licenseImage: '',
    employeeName: '',
    employeePhone: '',
    employeeType: '',
  };

  it('omits ownerId for an owner account and blank optional fields', () => {
    expect(buildCreateVehiclePayload(values, { isOwnerUser: true })).toEqual({
      vehicleType: 'OWNER',
      plateLetters: 'ع س ل',
      plateNumbers: '444',
      brand: 'Hyundai',
    });
  });

  it('sends ownerId when staff create an owner vehicle', () => {
    expect(buildCreateVehiclePayload(values, { isOwnerUser: false }).ownerId).toBe('owner-1');
  });

  it('sends employee fields and never ownerId for employee vehicles', () => {
    const payload = buildCreateVehiclePayload(
      { ...values, vehicleType: 'EMPLOYEE', employeeName: ' Sam ', employeePhone: '0100', employeeType: 'Driver' },
      { isOwnerUser: false },
    );
    expect(payload).toMatchObject({ employeeName: 'Sam', employeePhone: '0100', employeeType: 'Driver' });
    expect(payload).not.toHaveProperty('ownerId');
  });

  describe('update', () => {
    const original = { vehicleType: 'OWNER', plateLetters: 'ع س ل', plateNumbers: '444', brand: 'Hyundai', color: null, licenseImage: null };
    const same = { ...original, color: '', licenseImage: '' };

    it('sends nothing when nothing changed', () => {
      expect(buildUpdateVehiclePayload(same, original)).toEqual({});
    });

    it('sends changed plate fields and nulls cleared optional fields', () => {
      expect(buildUpdateVehiclePayload({ ...same, plateNumbers: '555' }, original)).toEqual({ plateNumbers: '555' });
      expect(buildUpdateVehiclePayload({ ...same, brand: '' }, original)).toEqual({ brand: null });
    });

    it('only considers employee fields for employee vehicles', () => {
      const employee = { ...original, vehicleType: 'EMPLOYEE', employeeName: 'Sam', employeePhone: '0100', employeeType: 'Driver' };
      expect(buildUpdateVehiclePayload({ ...employee, color: '', licenseImage: '', employeeName: 'Max' }, employee)).toEqual({ employeeName: 'Max' });
      expect(buildUpdateVehiclePayload({ ...same, employeeName: 'Ignored' }, original)).toEqual({});
    });
  });
});

describe('gate payloads', () => {
  it('trims and puts directions in In, Out order', () => {
    expect(buildCreateGatePayload({ gateName: ' Main ', gateCode: ' G-1 ', direction: ['Out', 'In'] })).toEqual({
      gateName: 'Main',
      gateCode: 'G-1',
      direction: ['In', 'Out'],
    });
  });

  it('updates only what changed and ignores direction order', () => {
    const original = { gateName: 'Main', gateCode: 'G-1', direction: ['In', 'Out'] };
    expect(buildUpdateGatePayload({ ...original, direction: ['Out', 'In'] }, original)).toEqual({});
    expect(buildUpdateGatePayload({ ...original, direction: ['In'] }, original)).toEqual({ direction: ['In'] });
    expect(buildUpdateGatePayload({ ...original, gateName: 'North' }, original)).toEqual({ gateName: 'North' });
  });
});
