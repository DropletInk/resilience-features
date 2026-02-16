import { rateLimitHandler } from "../middleware/rateLimitHandler";
import client from "../config/redis";

beforeAll(async () => {
  await client.connect();
  await client.flushAll();
});

describe("Rate limit testing", () => {
  test("blocks request after max request limit reached", async () => {
    const req: any = { ip: "127.0.0.1" };

    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    for (let i = 0; i < 6; i++) {
      await rateLimitHandler(req, res, next);
    }

    expect(next).toHaveBeenCalledTimes(5);
    expect(res.status).toHaveBeenCalledWith(429);
  });
});
