import { readFileSync, unlink, writeFile, writeFileSync } from 'fs';

type JSONData = Parameters<typeof JSON.stringify>[0];

/**
 * Simple function to read a JSON file and parse it
 * @param filepath The path to the file
 * @returns The parsed JSON data
 */
export const readFromFile = <T>(filepath: string): T => {
  const readerBuffer = readFileSync(filepath);

  return JSON.parse(readerBuffer.toString());
};

/**
 * Simple function to write JS data to a JSON file
 * @param filepath The path to the file
 * @param data The data to write. Can be any JS data type
 */
export const writeToFile = (filepath: string, data: JSONData) => {
  writeFile(filepath, JSON.stringify(data), { flag: 'w' }, err => err && console.error(err));
};

/**
 * Function to handle potential errors when unlinking a file
 * @param err The error, if any
 */
const unlinkErrorHandler = (err: NodeJS.ErrnoException | null) => {
  if (err && err.code === 'ENOENT') {
    // file doesn't exist
  } else if (err) {
    console.error(err); // other errors, e.g. maybe we don't have enough permission
  } else {
    // successful
  }
};

/**
 * Simple function to delete a file
 * @param filename The path to the file
 */
export const deleteFile = (filename: string) => unlink(filename, unlinkErrorHandler);

/**
 * Simple function to add data to an array stored in a JSON file. The top level of the file MUST be an array
 * @param filepath The path to the file
 * @param data The data to add. Can be any JS data type
 */
export const addToFile = (filepath: string, data: JSONData) => {
  const buffer = readFileSync(filepath, { flag: 'a+' });
  const readData = buffer.toString() || '[]';
  const dataArray: JSONData[] = JSON.parse(readData);
  dataArray.push(data);
  writeToFile(filepath, dataArray);
};

const errorFile = `errors/${new Date().getTime()}.json`;
/**
 * Simple function to log an error to a file in the `errors` directory using the current timestamp as the filename
 * Errors are stored in an array, so multiple errors can be logged to the same file during script execution
 * @param e The error to log
 * @example
 * try {
 *  // some code
 * } catch (e) {
 *  logError(e);
 * }
 *
 * // errors/1621234567890.json
 * [
 *  {
 *   "message": "some error message",
 *   "stack": "some error stack"
 *  }
 * ]
 */
export const logError = (e: unknown) => {
  const errorBuffer = readFileSync(errorFile, { flag: 'a+' });
  const errorData = errorBuffer.toString() || '[]';
  const errorArray: Error[] = JSON.parse(errorData);
  if (e instanceof Error) {
    try {
      errorArray.push(JSON.parse(e.message));
      writeFileSync(errorFile, JSON.stringify(errorArray), { flag: 'w' });
    } catch (_e) {
      console.error(e);
    }
  }
};
