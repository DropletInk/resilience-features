import { advancedRetryHandler } from "../src/middleware/retryHandler.js";
import { describe, test, expect } from "@jest/globals";
describe("retryHandler Tests", () => {
  test.each([
    [0, 1, "Success"],
    [2, 3, "Success"],
    [4, 4, "Success"],
    [5, 6, "Success"],
  ])(
    "Success test cases of retry handler",
    async (failCount: number, maxRetry: number, expectedResult: string) => {
      let count = 0;

      let res = await advancedRetryHandler({
        fn: async () => {
          count++;
          if (count < failCount) {
            throw new Error("Temporary Failed");
          }
          return "Success";
        },
        retries: maxRetry,
      });
      expect(res).toBe(expectedResult);
    },
  );

  test.each([
    [2, 0],
    [3, 1],
    [6, 4],
    [5, 2],
    [10, 5],
  ])("Failure test cases", async (failCount, maxRetry) => {
    let count = 0;
    await expect(
      advancedRetryHandler({
        fn: async () => {
          count++;
          if (count < failCount) {
            throw new Error("Always fail");
          }
        },
        retries: maxRetry,
      }),
    ).rejects.toThrow("Always fail");
  });
});
