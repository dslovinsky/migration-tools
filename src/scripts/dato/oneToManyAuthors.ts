import getDatoClient from 'lib/Dato/getDatoClient';
import batch from 'utils/batch';
import { logError, writeToFile } from 'utils/fsUtils';

const oneToManyAuthors = async () => {
  const client = getDatoClient();

  const blogPosts = await client.items.list({
    page: {
      limit: 500,
    },
    filter: {
      type: '2374067',
    },
    version: 'current',
  });

  const updatedBlogPosts = await batch(
    blogPosts,
    async blogBatch => {
      try {
        const updateRecordsPromise = blogBatch.map(blog =>
          client.items.update(blog.id, {
            authors: [blog.author],
          }),
        );

        return await Promise.all(updateRecordsPromise);
      } catch (err) {
        logError(err);
      }

      return [];
    },
    80,
  );

  const blogPostsToPublish = updatedBlogPosts?.flatMap(({ meta, id }) => {
    if (meta.status === 'updated') {
      return {
        type: 'item',
        id,
      } as const;
    }

    return [];
  });

  const publishedRecords =
    blogPostsToPublish &&
    (await client.items.bulkPublish({
      items: blogPostsToPublish,
    }));

  writeToFile('logs/updateBlogPosts.json', updatedBlogPosts);
  writeToFile('logs/publishedBlogPosts.json', publishedRecords);
};

oneToManyAuthors();
