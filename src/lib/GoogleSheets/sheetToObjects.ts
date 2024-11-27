import { camelCase } from 'utils/casers';

/**
 * Converts a Google Sheets object to an array of objects with the column headers as keys
 * By default, Google Sheet's API returns an array of arrays, where the first array is the column headers.
 * This is confusing and hard to work with, so this function converts it to an array of objects, where each object represents a row in the sheet, and the keys are the column headers
 * @param sheet Raw data fetched from Google Sheets' API
 * @returns An array of objects representing each row in the sheet
 */
const sheetToObjects = (sheetValues: string[][]) => {
  const [headers, ...rows] = sheetValues;

  return rows.map(row =>
    row.reduce<{ [key: string]: string }>(
      (prevValue, currentValue, index) => ({
        ...prevValue,
        [camelCase(headers[index])]: currentValue,
      }),
      {},
    ),
  );
};

export default sheetToObjects;
