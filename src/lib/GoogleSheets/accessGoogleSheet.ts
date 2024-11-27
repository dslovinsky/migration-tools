import { JWT } from 'google-auth-library';
import { google } from 'googleapis';

import credentials from '../../../jwt/alchemy-348614-6e1e37ddf68a.json';

/**
 * Accesses a Google Sheet using a local service account JSON file
 * @param spreadsheetId
 * @param range
 * @returns The raw data values from the specified sheet + range
 */
const accessGoogleSheet = async <T extends string[][]>(spreadsheetId: string, range: string) => {
  const auth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  return response.data.values as T;
};

export default accessGoogleSheet;
