export type valueof<T> = T[keyof T];
export type Flatten<T> = T extends unknown[] ? T[number] : T;

type ObjectEntriesReturn<T> = [keyof T, valueof<T>][];
type ObjectEntries = <T extends object>(object: T) => ObjectEntriesReturn<T>;
type ObjectKeys = <T extends object>(object: T) => (keyof T)[];

/**
 * Works just like `Object.entries`, but with a type-safe return value
 * @param object The object to get entries from
 * @returns An array of key-value pairs
 */
export const objectEntries: ObjectEntries = object => Object.entries(object) as ObjectEntriesReturn<typeof object>;

/**
 * Works just like `Object.keys`, but with a type-safe return value
 * @param object The object to get keys from
 * @returns An array of keys
 */
export const objectKeys: ObjectKeys = object => Object.keys(object) as (keyof typeof object)[];

/**
 * Works just like `Object.hasOwnProperty`, but also acts as a type guard, allowing TS to infere the type of the key after being called in scope
 * @param object The object with the potential key
 * @returns Boolean for whether the object has the key
 */
export const hasOwnProperty = <T extends Record<string, unknown>>(
  object: T,
  potentialKey: string | number | symbol,
): potentialKey is keyof T => object[potentialKey as keyof object] !== undefined;

/**
 * Works exactly like `fetch`, but automatically parses the response as JSON and accepts a generic type parameter to infer the response type
 * @param args The same arguments as `fetch`
 * @returns The JSON response.
 */
export const fetchJson = async <T>(...args: Parameters<typeof fetch>): Promise<T> => {
  const response = await fetch(...args);

  return (await response.json()) as T;
};

export default fetchJson;
