import { logError } from 'utils/fsUtils';
import getContentType from 'utils/getContentType';

import type { Environment } from 'contentful-management';

type ImageOptions = {
  url: string;
  fileName: string;
  locale?: string;
  title: string;
  description?: string;
};

/**
 * Uploads an asset to Contentful
 * @param targetEnvironment The Contentful environment to upload the asset to
 * @param id The ID the asset should have in Contentful
 * @param url The URL of the asset
 * @param fileName The name of the asset
 * @param locale The locale of the asset. Defaults to 'en-US'. If you want different asset data per locale, use Contentful's APi client directly
 * @param title The title of the asset
 * @param description The description of the asset
 * @returns A promise that resolves when the asset is uploaded with the asset's Contentful data
 */
const uploadAsset = async (
  targetEnvironment: Environment,
  id: string,
  { url, fileName, locale = 'en-US', title, description = '' }: ImageOptions,
) => {
  if (!url) {
    return;
  }
  try {
    const uploadedAsset = await targetEnvironment
      .createAssetWithId(id, {
        fields: {
          title: {
            [locale]: title,
          },
          description: {
            [locale]: description,
          },
          file: {
            [locale]: {
              fileName,
              contentType: (await getContentType(url)) || 'image/jpeg',
              upload: url.includes('https') ? url : `https:${url}`,
            },
          },
        },
      })
      .then(asset => asset.processForAllLocales());

    return await uploadedAsset.publish();
  } catch (e) {
    logError(e);
  }
};

export default uploadAsset;
