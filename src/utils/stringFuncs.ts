import MurmurHash3 from 'imurmurhash';
import { v4 as uuid } from 'uuid';

/**
 * Generates a random string of letters and numbers
 * @param charCount The number of characters to generate. Default: `22`
 * @returns A random string of characters
 */
export const getRandString = (charCount = 22) => uuid().replaceAll('-', '').substring(0, charCount);

/**
 * Returns a hash of a string. Hashes are unique but predictable, making them useful for generating IDs while avoiding collisions and tying them to a specific string (such as an internal name)
 * @param seed The string to hash
 * @returns The hashed string
 */
export const hashString = (seed: string | number | undefined) =>
  !!seed || seed === 0 ? MurmurHash3(seed.toString()).result().toString() : undefined;
