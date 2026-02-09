import { start } from "node:repl";

export const timeoutHandler = async (
  fn: () => Promise<any>,
  timeout = 10000,
) => {
  const start = Date.now();

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const duration = Date.now() - start;
      reject(new Error(`Request Timeout after ${duration/1000}sec`));
    }, timeout);

    fn()
      .then((result) => {
        const duration = Date.now()-start
        clearTimeout(timer);
        console.log(`Request completed after ${duration/1000}sec`);
        resolve(result);
      })
      .catch((error) => {
        const duration = Date.now() - start;
        clearTimeout(timer);
        console.error(`Request failed after ${duration/1000}sec`);
        reject(error);
      });
  });
};
