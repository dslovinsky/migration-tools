import { validate } from 'datocms-structured-text-utils';
import { logError } from 'utils/fsUtils';

import type { Document } from 'datocms-structured-text-utils';

/**
 * Converts a plain text string to a DatoCMS structured text document
 * @param plainText The plain text to convert
 * @returns A DatoCMS structured text document
 */
const stringToDast = (plainText: string) => {
  const dast: Document = {
    schema: 'dast',
    document: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'span',
              value: plainText,
            },
          ],
        },
      ],
    },
  };

  const result = validate(dast);

  if (!result.valid) {
    logError(result.message);

    return;
  }

  return dast;
};

export default stringToDast;
