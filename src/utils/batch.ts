/**
 * A utility to process a large array in batches
 * Management APIs often don't work well with large datasets, so this allows you to break up the process by running a callback on a batch of items at a time
 * @param itemsToProcess The full array of items to process
 * @param callback The callback to run on each batch
 * @param batchSize The number of items to process at a time. Default: `100`
 * @returns A promise that resolves when all batches have been processed with an array of all the returned values from the callback
 * @example
 * const blogPosts = [
 *  { id: '1', title: 'asd' },
 *  { id: '2', title: 'zxc' },
 * ];
 * const uploadedAssets = await batch(
 *  blogPosts,
 *   async batch => {
 *    return await Promise.all(
 *     batch.map(async blog => {
 *      const createdPost = await contentfulEnvironment.createEntry('templateBlogPost', blog);
 *      return createdPost;
 *     }),
 *    );
 *   },
 *  1,
 * );
 */
const batch = async <T, U>(itemsToProcess: T[], callback: (itemBatch: T[]) => Promise<U[]>, batchSize = 100) => {
  let whileIndex = 0;
  const totalItemCount = itemsToProcess.length;
  const allReturnedItems: U[] = [];

  while (whileIndex * batchSize < totalItemCount) {
    const start = whileIndex * batchSize;
    const isLastBatch = start + batchSize >= totalItemCount;
    const end = start + batchSize < totalItemCount ? start + batchSize : totalItemCount;

    const itemBatch = itemsToProcess.slice(start, end);

    console.log(`Processing ${start + 1}-${end} of ${totalItemCount}`);

    const callbackReturn = await callback(itemBatch);

    callbackReturn && whileIndex++;
    allReturnedItems.push(...callbackReturn);

    if (isLastBatch) {
      return allReturnedItems;
    }
  }
};

export default batch;
