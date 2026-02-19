import { rateLimitHandler } from "../middleware/rateLimitHandler";
import client from "../config/redis";

beforeAll(async () => {
  await client.connect();
});

afterAll(async () => {
  await client.quit();
});

describe("Rate limit testing", () => {
  test.each([
    [4, 5],
    [5, 5],
    [8, 9],
    [4, 3],
    [0, 1],
    [2, 0],
    [7, 10],
    [8, 7],
  ])("ratelimit handler tests: %i requests with %i maxLimit", async (requestCount, maxRequests) => {
    await client.flushAll();
    const req: any = { ip: "127.0.0.1" };

    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    let middleware = rateLimitHandler({ maxRequests: maxRequests });

    for (let i = 1; i <= requestCount; i++) {
      await middleware(req, res, next);
    }

    expect(next).toHaveBeenCalledTimes(Math.min(requestCount, maxRequests));
  });
});
