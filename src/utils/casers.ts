const wordSeparators = /[-_\\.+\s]+/g;
const notAlphaNumericOrSpace = /[^ a-zA-Z0-9]+/g;
const notAlphaNumericSpaceOrDash = /[^ a-zA-Z0-9-]/g;
const capitalizedFirstLetter = /[A-Z]+(?![a-z])|[A-Z]/g;

/**
 * Converts a string to camelCase
 * @param string The string to convert
 * @returns The camelCased string
 */
export const camelCase = (string: string): string => {
  const cleanedString = string
    .replace(wordSeparators, ' ')
    .replace(notAlphaNumericOrSpace, '')
    .replace(capitalizedFirstLetter, ($, ofs) => (ofs ? ' ' : '') + $.trim().toLowerCase())
    .trim();
  const words = cleanedString.split(' ');
  const camelCasedWords = words.map((word, index) =>
    index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
  );
  const camelCasedString = camelCasedWords.join('');

  return camelCasedString;
};

/**
 * Converts a string to kebeb-case
 * @param string The string to convert
 * @returns The kebeb-cased string
 */
export const kebabCase = (str: string) =>
  str
    .trim()
    .replace(wordSeparators, '-')
    .replace(notAlphaNumericSpaceOrDash, '')
    .replace(capitalizedFirstLetter, ($, ofs) => (ofs ? '-' : '') + $.trim().toLowerCase())
    .replace(/--+/g, '-');
