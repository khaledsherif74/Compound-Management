/** Mirrors backend src/utils/plate.js and vehicle.validation.js patterns. */

const ARABIC_INDIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

/** Arabic letters and/or digits, optional single spaces (diplomatic plates may contain digits). */
export const PLATE_LETTERS_PATTERN = /^[\u0621-\u064A0-9\u0660-\u0669](?:\s?[\u0621-\u064A0-9\u0660-\u0669])*$/;

/** Western or Arabic-Indic digits only. */
export const DIGITS_PATTERN = /^[0-9\u0660-\u0669]+$/;

export const toWesternDigits = (value = '') =>
  String(value).replace(/[\u0660-\u0669]/g, digit => String(digit.charCodeAt(0) - 0x0660));

export const toArabicIndicDigits = (value = '') =>
  String(value).replace(/[0-9]/g, digit => ARABIC_INDIC_DIGITS[Number(digit)]);

export const normalizeLetters = (letters = '') => letters.replace(/\s+/g, '');

export const normalizeNumbers = (numbers = '') => toWesternDigits(numbers).replace(/\s+/g, '');

/** Plain-text plate as shown on the car: digits first, then letters, in Arabic-Indic digits. */
export const formatPlate = ({ plateLetters = '', plateNumbers = '' } = {}) =>
  `${toArabicIndicDigits(plateNumbers)} ${toArabicIndicDigits(plateLetters)}`.trim();

const ARABIC_LETTERS = /[\u0621-\u064A]/g;
const DIGITS = /[0-9\u0660-\u0669]/g;

/** Splits raw plate text (as read by a camera or typed) into Arabic letters and digits, in any order. */
export const splitPlateText = (text = '') => {
  if (!text) return { letters: '', numbers: '' };
  const western = toWesternDigits(text);
  return {
    letters: (western.match(ARABIC_LETTERS) || []).join(' '),
    numbers: (western.match(DIGITS) || []).join(''),
  };
};
