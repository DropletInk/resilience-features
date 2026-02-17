import { retryHandler } from "../middleware/retryHandler";

describe("retryHandler Tests", () => {
  test("Retry until success", async () => {
    let count = 0;

    const result = await retryHandler(
      async () => {
        count++;
        console.log(`Attempt: ${count}`);
        if (count < 4) {
          throw new Error("Temporary failed");
        }
        console.log("Success");
        return "Success";
      },
      3,
      1000,
    );

    expect(result).toBe("Success");
  }, 10000);

  test("Fail after max retry", async () => {
    let count = 0;

    await expect(
      retryHandler(
        async () => {
          count++;
          throw new Error("Always fail");
        },
        2,
        1000,
      ),
    ).rejects.toThrow("Always fail");
  }, 10000);
});