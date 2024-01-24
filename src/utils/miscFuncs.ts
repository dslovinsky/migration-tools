/**
 * Disables logs from third-party libraries, like Contentful's management client which pollute the console
 * Errors are still logged
 * To enable, simple call the function at the top of your script
 */
export const cleanConsoleLog = () => {
  /* eslint-disable no-console */
  const originalConsoleLog = console.log;
  console.log = (message, ...optionalMessages) => {
    if (typeof message === 'string' && (message.includes('[info]') || message.includes('[warning]'))) {
      return;
    }
    originalConsoleLog(message, ...optionalMessages);
  };
  /* eslint-enable no-console */
};

/**
 * Sleeps for a given number of milliseconds. Only use if absolutely necessary, as it blocks the thread
 * @param ms The number of milliseconds to sleep
 * @returns A promise that resolves after the given number of milliseconds
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });
