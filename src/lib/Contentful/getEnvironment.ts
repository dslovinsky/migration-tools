import { createClient } from 'contentful-management';
import { configDotenv } from 'dotenv';
import { cleanConsoleLog } from 'utils/miscFuncs';

import type { CreateHttpClientParams } from 'contentful-sdk-core';

configDotenv();
cleanConsoleLog();

const { CONTENTFUL_SPACE_ID, CONTENTFUL_ENV, CONTENTFUL_MGMT_TOKEN } = process.env;

const clientDefaults: Omit<CreateHttpClientParams, 'accessToken'> = {
  throttle: 'auto',
  retryOnError: true,
  retryLimit: 100000,
};

type GetEnvironmentArgs = {
  managementToken?: string | undefined;
  spaceId?: string | undefined;
  environmentId?: string | undefined;
};

const defaultSecrets = { managementToken: CONTENTFUL_MGMT_TOKEN, spaceId: CONTENTFUL_SPACE_ID, environmentId: CONTENTFUL_ENV };

/**
 * Gets a Contentful environment using secrets. If no secrets are provided, it will use default environment variable names
 * @param managementToken The Contentful management token
 * @param spaceId The Contentful space ID
 * @param environmentId The Contentful environment ID
 * @returns The Contentful environment
 */
const getEnvironment = async (secrets?: GetEnvironmentArgs) => {
  const { managementToken, spaceId, environmentId } = { ...defaultSecrets, ...secrets };
  if (!managementToken || !spaceId || !environmentId) {
    throw new Error('Missing env variable');
  }

  const managementClient = createClient({
    accessToken: managementToken,
    ...clientDefaults,
  });

  const space = await managementClient.getSpace(spaceId);
  const environment = await space.getEnvironment(environmentId);

  return environment;
};

export default getEnvironment;
