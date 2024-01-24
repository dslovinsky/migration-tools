import getEntries from 'lib/Contentful/getEntries';
import batch from 'utils/batch';
import { logError } from 'utils/fsUtils';

import type { Environment, QueryOptions } from 'contentful-management';

/**
 * Deletes all entries of given content models in Contentful
 * Any number of content models can be provided in an array
 * Optionally, a query can be provided to delete only entries that match the query
 * @param environment The Contentful environment to delete the entries from
 * @param contentModelsToDelete Array of content model IDs to delete entries of
 * @param deleteModels Whether or not to delete the content models after deleting the entries. Defaults to `false`
 * @param queryOptions The query options for the entries. Uses the same query options as `environment.getEntries`
 * @example
 * deleteEntries(environment, ['templateBlogPost', 'templateNews'], false, {
    'sys.publishedAt[exists]': true, // delete only published entries of blog post and news
  });
 */
const deleteEntries = async (
  environment: Environment,
  contentModelsToDelete: string[],
  deleteModels = false,
  queryOptions?: QueryOptions,
) => {
  const deleteEntriesOfModel = async (contentModel: string) => {
    try {
      const entriesOfModel = await getEntries(environment, { content_type: contentModel, limit: 0, include: 0, ...queryOptions });

      const deletedEntries = await batch(entriesOfModel, async entriesOfModelBatch => {
        const deletedEntriesBatch = await Promise.all(
          entriesOfModelBatch.map(async entry => {
            const draftEntry = entry.isPublished() ? await entry.unpublish() : entry;

            return await draftEntry.delete();
          }),
        );

        return deletedEntriesBatch;
      });

      return deletedEntries;
    } catch (error) {
      console.error(`Error with content model: ${contentModel}. Logged to errors directory`);
      logError(error);
    }
  };

  const deleteEntriesOfEachModel = async () =>
    await Promise.all(
      contentModelsToDelete.map(async contentModel => {
        const deleteResponse = await deleteEntriesOfModel(contentModel);
        deleteResponse && console.log(`All ${contentModel} entries have been deleted`);

        return deleteResponse;
      }),
    );

  const deleteEntriesOfEachModelResponse = await deleteEntriesOfEachModel();

  const deleteContentModels = async () => {
    deleteEntriesOfEachModelResponse &&
      contentModelsToDelete.forEach(async contentModel => {
        const entryMetaData = await environment.getEntries({ content_type: contentModel, limit: 0, include: 0 });
        const contentModelHasEntries = !!entryMetaData.total;
        if (!contentModelHasEntries) {
          const contentType = await environment.getContentType(contentModel);
          const contentTypeUnpublishResponse = !contentType.isPublished() || !!(await contentType.unpublish());
          contentTypeUnpublishResponse && (await contentType.delete());
          console.log(`${contentModel} was successfully deleted`);
        } else {
          console.error(`${contentModel} could not be deleted because there was a problem removing all of its entries`);
        }
      });
  };

  deleteModels && deleteContentModels();
};

export default deleteEntries;
