import { camelCase } from 'utils/casers';

// eslint-disable-next-line import/prefer-default-export
export const camelCaseObjKeys = <T extends Record<string, unknown>>(obj: T): T =>
  Object.entries(obj).reduce((acc, [key, value]) => ({ ...acc, [camelCase(key)]: value }), {} as T);
