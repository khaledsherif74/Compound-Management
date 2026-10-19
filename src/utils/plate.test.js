import {
  DIGITS_PATTERN,
  formatPlate,
  normalizeLetters,
  normalizeNumbers,
  PLATE_LETTERS_PATTERN,
  splitPlateText,
  toArabicIndicDigits,
  toWesternDigits,
} from './plate';

describe('digit conversion', () => {
  it('converts Arabic-Indic digits to Western and back', () => {
    expect(toWesternDigits('٠١٢٣٤٥٦٧٨٩')).toBe('0123456789');
    expect(toArabicIndicDigits('0123456789')).toBe('٠١٢٣٤٥٦٧٨٩');
  });

  it('leaves letters and other characters untouched', () => {
    expect(toWesternDigits('ع س ل ١٢٣')).toBe('ع س ل 123');
    expect(toArabicIndicDigits('ع-1')).toBe('ع-١');
  });

  it('copes with missing input', () => {
    expect(toWesternDigits()).toBe('');
    expect(toArabicIndicDigits(undefined)).toBe('');
  });
});

describe('normalization (same as the backend)', () => {
  it('strips whitespace from letters', () => {
    expect(normalizeLetters('ع س ل')).toBe('عسل');
  });

  it('strips whitespace and converts digits for numbers', () => {
    expect(normalizeNumbers('١٢ ٣٤')).toBe('1234');
  });
});

describe('PLATE_LETTERS_PATTERN', () => {
  it.each(['ع س ل', 'عسل', 'أ ب', '12', 'ع 1'])('accepts %s', value => {
    expect(PLATE_LETTERS_PATTERN.test(value)).toBe(true);
  });

  it.each(['', ' ع', 'ع ', 'ع  س', 'abc', 'ع-س'])('rejects %j', value => {
    expect(PLATE_LETTERS_PATTERN.test(value)).toBe(false);
  });
});

describe('DIGITS_PATTERN', () => {
  it('accepts Western and Arabic-Indic digits only', () => {
    expect(DIGITS_PATTERN.test('444')).toBe(true);
    expect(DIGITS_PATTERN.test('٤٤٤')).toBe(true);
    expect(DIGITS_PATTERN.test('')).toBe(false);
    expect(DIGITS_PATTERN.test('12a')).toBe(false);
    expect(DIGITS_PATTERN.test('1 2')).toBe(false);
  });
});

describe('formatPlate', () => {
  it('shows digits first, then letters, in Arabic-Indic digits', () => {
    expect(formatPlate({ plateLetters: 'ع س ل', plateNumbers: '444' })).toBe('٤٤٤ ع س ل');
  });

  it('handles missing parts', () => {
    expect(formatPlate({ plateNumbers: '12' })).toBe('١٢');
    expect(formatPlate()).toBe('');
  });
});

describe('splitPlateText', () => {
  it('separates letters and digits regardless of their order', () => {
    expect(splitPlateText('444 ع س ل')).toEqual({ letters: 'ع س ل', numbers: '444' });
    expect(splitPlateText('ع س ل ٤٤٤')).toEqual({ letters: 'ع س ل', numbers: '444' });
  });

  it('returns empty parts when nothing is readable', () => {
    expect(splitPlateText('')).toEqual({ letters: '', numbers: '' });
    expect(splitPlateText('ABC')).toEqual({ letters: '', numbers: '' });
  });
});
