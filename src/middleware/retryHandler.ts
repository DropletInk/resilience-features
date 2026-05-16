import pRetry from "p-retry";
import { RetryContext } from "p-retry";

type BasicRetryOptions<T> = {
  fn: () => Promise<T>;
  retries?: number;
  minTimeout?: number;
  factor?: number;
};

export const basicRetryHandler = async <T>({ fn, retries = 3, minTimeout = 1000, factor = 2 }: BasicRetryOptions<T>) => {
  try {
    const result = await pRetry(
      async () => {
        return await fn();
      },
      {
        retries: retries,
        factor: factor,
        minTimeout: minTimeout,
        onFailedAttempt: (error: RetryContext) => {
          if (error.retriesLeft <= 0) {
            console.log("Retry limit exceeded");
          } else {
            const delay = minTimeout * factor ** (error.attemptNumber - 1);
            console.log(`Attempt ${error.attemptNumber} failed. ${error.retriesLeft} retries left.  Retrying in ${Math.round(delay / 1000)}s`);
          }
        },
      },
    );
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("An error occurred after maximum number of retries:", error.message);
      throw error;
    }
    throw new Error("Unknown error during retry");
  }
};

export const advancedRetryHandler = async <T>(
  options: {
    fn: () => Promise<T>;
  } & Parameters<typeof pRetry>[1],
): Promise<T> => {
  const { fn, ...advanceRetryOptions } = options;

  return pRetry(fn, advanceRetryOptions);
};
