import { type ClientConfigOptions, LogLevel, buildClient } from '@datocms/cma-client-node';
import { configDotenv } from 'dotenv';

configDotenv();

const { DATO_API_TOKEN, DATO_ENV } = process.env;

type GetClientArgSecrets = {
  apiToken?: string | undefined;
  environment?: string | undefined;
};

const defaultConfigOptions = {
  logLevel: LogLevel.BASIC,
  autoRetry: true,
  requestTimeout: 36000000, // 10 hours
};

const defaultSecrets = { apiToken: DATO_API_TOKEN, environment: DATO_ENV };

/**
 * Gets a Dato client using secrets. If no secrets are provided, it will use default environment variable names
 * @param apiToken The Dato API token
 * @param environmentId The Dato environment ID
 * @param configOptions Additional config options to pass to the client
 * @returns The Dato client
 */
const getDatoClient = (secrets?: GetClientArgSecrets, configOptions?: Partial<ClientConfigOptions>) => {
  const { apiToken, environment } = { ...defaultSecrets, ...secrets };
  if (!apiToken) {
    throw new Error('Missing DatoCMS credentials');
  }

  return buildClient({
    apiToken,
    environment,
    ...defaultConfigOptions,
    ...configOptions,
  });
};

export default getDatoClient;
