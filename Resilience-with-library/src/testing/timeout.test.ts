import { timeoutHandler } from "../middleware/timeoutHandler";

describe("Timeout Handler Test", () => {
  test("Timeout Testing Success", async () => {
    const res = await timeoutHandler(async () => {
      await new Promise((r) => setTimeout(r, 4000));
      return "Completed before timeout";
    });
    console.log("Timeout Test Success");
    expect(res).toBe("Completed before timeout");
  });

  test("Failed after timeout", async () => {
    await expect(
      timeoutHandler(async () => {
        await new Promise((r) => setTimeout(r, 6000));
      }),
    ).rejects.toThrow("timed out");
    console.log("Failed after timeout");
  });
});
