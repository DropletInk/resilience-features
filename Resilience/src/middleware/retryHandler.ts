export const retryHandler = async (
  fn: () => Promise<any>,
  maxRetry: number = 3,
  iniDelay: number = 1000,
  expBackoffMultiplier:number = 2
) => {
  for (let attempt = 0; attempt < maxRetry; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetry - 1) {
        console.error("Retry limit exceeded");
        throw error;
      }

      const delay = iniDelay * expBackoffMultiplier ** attempt;

      console.log(`Attempt failed. Retrying in ${delay / 1000}s...`);

      await new Promise((r) => {
        setTimeout(r, delay);
      });
    }
  }
  throw new Error("Unexpected retry failed");
};
