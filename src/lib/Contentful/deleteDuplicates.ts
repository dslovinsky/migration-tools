import getContentfulEntries from 'lib/Contentful/getEntries';
import { dedupe } from 'utils/arrayFuncs';
import batch from 'utils/batch';

import type { Environment } from 'contentful-management';

/**
 * Deletes all duplicates of a given content model in Contentful. Useful for removing duplicate blog authors, companies, etc.
 * Choose a field that should be unique for each entry (ex. Entity: Person's `name` field) to determine which entries are duplicates
 * The function will use the entry's creation date to determine which entry is the original and which are duplicates, deleting the duplicates and keeping the first one
 * @param environment The Contentful environment to delete the duplicates from
 * @param contentModelId The ID of the content model to delete duplicates of
 * @param uniqueField The field that should be unique for each entry
 * @param locale The locale of the unique field. Defaults to 'en-US'
 * @returns A promise that resolves when all duplicates are deleted with the remaining entries
 */
const deleteDuplicates = async (environment: Environment, contentModelId: string, uniqueField: string, locale = 'en-US') => {
  const allEntriesOfType = await getContentfulEntries(environment, {
    content_type: contentModelId,
  });

  const uniqueFieldVals = dedupe(allEntriesOfType.map(entry => entry.fields[uniqueField][locale] as string));

  const allRemainingEntries = await batch(uniqueFieldVals, async uniqueFieldValsBatch => {
    const remainingEntries = await Promise.all(
      uniqueFieldValsBatch.map(async uniqueFieldValue => {
        const { items: entriesWithThatName } = await environment.getEntries({
          content_type: contentModelId,
          [`fields.${uniqueField}`]: uniqueFieldValue,
          order: 'sys.createdAt',
        });

        const [original, ...duplicates] = entriesWithThatName;

        duplicates.forEach(async duplicate => {
          const draftDuplicate = duplicate.isPublished() ? await duplicate.unpublish() : duplicate;
          draftDuplicate.delete();
        });

        return original;
      }),
    );

    return remainingEntries;
  });

  return allRemainingEntries;
};

export default deleteDuplicates;
