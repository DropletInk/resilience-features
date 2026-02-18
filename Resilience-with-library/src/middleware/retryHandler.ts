import pRetry from "p-retry";

type RetryOptions<T> = {
  fn: () => Promise<T>;
  maxRetry: number;
  iniDelay: number;
  exBackoffMultiplier: number;
};

export const retryHandler = async <T>({
  fn,
  maxRetry,
  iniDelay,
  exBackoffMultiplier,
}: RetryOptions<T>): Promise<T> => {
  try {
    const result = await pRetry(
      async () => {
        return await fn();
      },
      {
        retries: maxRetry,
        factor: exBackoffMultiplier,
        minTimeout: iniDelay,
        onFailedAttempt: (error: any) => {
          if (error.retriesLeft === 0) {
            console.log("Retry limit exceeded");
            return;
          }

          const delay =
            iniDelay * exBackoffMultiplier ** (error.attemptNumber - 1);
          console.log(
            `Attempt failed. Retrying in ${Math.round(delay / 1000)}s`,
          );
        },
      },
    );
    // console.log("Success");
    return result;
  } catch (error) {
    console.log("Request failed after retries");
    throw error;
  }
};
