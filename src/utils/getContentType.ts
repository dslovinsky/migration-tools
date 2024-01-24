/**
 * Fetches the content type of an asset from its URL.
 * Useful for some APIs like Contentful that need to know the content type of an asset before uploading it
 * @param url The URL of the asset
 * @returns
 */
const getContentType = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (!response.ok) {
      throw new Error(`HTTP error on URL: "${url}": ${response.status}`);
    }

    const contentType = response.headers.get('content-type');

    return contentType || null;
  } catch (error) {
    console.error(`Error fetching file content type from URL: ${url}`, error);

    return null;
  }
};

export default getContentType;
