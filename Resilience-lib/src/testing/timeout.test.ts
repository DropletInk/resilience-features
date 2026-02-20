import { timeoutHandler } from "../middleware/timeoutHandler";

describe("Timeout Handler Test", () => {
  test.each([
    [4000, 5000],
    [6000, 6000],
    [3000, 6000],
    [0, 2],
    [3810, 4000],
  ])("Timeout success testing", async (timeRequired, maxTimeoutTime) => {
    const res = await timeoutHandler({
      fn: async () => {
        await new Promise((r) => setTimeout(r, timeRequired));
        return "Completed Before Timeout";
      },
      time: maxTimeoutTime,
    });
    console.log("Timeout test success");
    expect(res).toBe("Completed Before Timeout");
  });

  test.each([
    [2000, 1000],
    [5000, 2000],
    [4000, 3999],
    [6000, 5000],
    [8000,7990]
  ])("Failed after timeout", async (timeRequired, maxTimeoutTime) => {
    await expect(
      timeoutHandler({
        fn: async () => {
          await new Promise((r) => setTimeout(r, timeRequired));
        },
        time: maxTimeoutTime,
      }),
    ).rejects.toThrow("timed out");
    console.log("Failed after timeout");
  });
});