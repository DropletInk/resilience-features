import { retryHandler } from "../src/middleware/retryHandler";
import { describe, test, expect } from "@jest/globals";
describe("retryHandler Tests", () => {
  test.each([
    [0, 1, "Success"],
    [2, 3, "Success"],
    [4, 4, "Success"],
    [6, 8, "Success"],
    [7, 6, "Success"],
    [9, 8, "Success"],
  ])(
    "Success test cases of retry handler",
    async (failCount, maxRetry, expectedResult) => {
      let count = 0;
      let res = await retryHandler({
        fn: async () => {
          count++;
          if (count < failCount) {
            throw new Error("Temporary failed");
          }
          return "Success";
        },
        maxRetry: maxRetry,
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
      retryHandler({
        fn: async () => {
          count++;
          if (count < failCount) {
            throw new Error("Always fail");
          }
        },
        maxRetry: maxRetry,
      }),
    ).rejects.toThrow("Always fail");
  });
});