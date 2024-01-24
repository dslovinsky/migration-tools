/**
 * Removes duplicate items from an array
 * @param array The array to dedupe
 * @returns The deduped array
 */
export const dedupe = <T>(array: T[]) => [...new Set(array)];

/**
 * Splits an array into two arrays based on a callback. Works like `Array().filter`, but returns two arrays instead of one
 * @param array The original array
 * @param callback The callback to determine which array to put a given element
 * @returns An array containing two arrays: the first containing elements that returned `true` from the callback, and the second containing elements that returned `false`
 */
export const partition = <T>(array: T[], callback: (element: T, index: number, totalArray: T[]) => boolean) =>
  array.reduce<[T[], T[]]>(
    (result, element, i) => {
      callback(element, i, array) ? result[0].push(element) : result[1].push(element);

      return result;
    },
    [[], []],
  );
