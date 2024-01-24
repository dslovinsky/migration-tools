import type { Entry, Environment, QueryOptions } from 'contentful-management';

/**
 * Gets all entries from Contentful that match a given query
 * Handles pagination automatically
 * @param environment The Contentful environment to get the entries from
 * @param queryOptions The query options for the entries
 * @param batchSize The size of each batch of entries to get. Defaults to `500`
 * @returns A promise that resolves when all entries are collected
 */
const getEntries = async (environment: Environment, queryOptions: QueryOptions, batchSize = 500) => {
  const { total: totalItemCount } = await environment.getEntries({
    ...queryOptions,
    limit: 0,
  });

  let whileIndex = 0;
  const allReturnedItems: Entry[] = [];

  while (whileIndex * batchSize < totalItemCount) {
    const skip = whileIndex * batchSize;
    const itemBatch = await environment.getEntries({
      ...queryOptions,
      order: 'sys.createdAt',
      limit: batchSize,
      skip,
    });
    const batchLength = itemBatch.items.length;
    const lastIndexInBatch = skip + batchSize;

    const contentModelMessage = queryOptions.content_type ? `${queryOptions.content_type} items` : '';

    console.log(
      `Collecting ${skip + 1}-${
        batchLength < batchSize ? skip + batchLength : lastIndexInBatch
      } of ${totalItemCount} ${contentModelMessage}`,
    );

    allReturnedItems.push(...itemBatch.items);

    itemBatch && whileIndex++;

    if (lastIndexInBatch >= totalItemCount) {
      return allReturnedItems;
    }
  }

  return allReturnedItems;
};

export default getEntries;
