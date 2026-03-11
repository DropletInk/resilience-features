import { basicTimeoutHandler } from "../src/middleware/timeoutHandler.js";
import { describe, test, expect } from "@jest/globals";
describe("Timeout Handler Test", () => {
  test.each([
    [4000, 5000],
    [6000, 6000],
    [3000, 6000],
    [0, 2],
    [3810, 4000],
  ])("Timeout success testing", async (timeRequired:number, maxTimeoutTime:number) => {
    const res = await basicTimeoutHandler({
      fn: async () => {
        await new Promise((r) => setTimeout(r, timeRequired));
        return "Completed Before Timeout";
      },
      time:maxTimeoutTime,
    });
    console.log("Timeout test success");
    expect(res).toBe("Completed Before Timeout");
  });

  test.each([
    [2000, 1000],
    [5000, 2000],
    [4000, 3999],
    [6000, 5000],
    [8000, 6000]
  ])("Failed after timeout", async (timeRequired, maxTimeoutTime) => {
    await expect(
      basicTimeoutHandler({
        fn: async () => {
          await new Promise((r) => setTimeout(r, timeRequired));
        },
        time: maxTimeoutTime,
      }),
    ).rejects.toThrow("timed out");
    console.log("Failed after timeout");
  });
});
