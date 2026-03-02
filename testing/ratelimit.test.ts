import { rateLimitHandler } from "../src/middleware/ratelimitHandler.js";
import { createRedisClient } from "../src/config/redis.js";
import { Request, Response } from "express";
import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  jest,
} from "@jest/globals";

const client = createRedisClient({
    username: 'default',
    password: 'Q3QuStLov8vxvNqykPyj1bOpk8tccOkv',
    socket: {
        host: 'redis-14227.crce281.ap-south-1-3.ec2.cloud.redislabs.com',
        port: 14227
    }
});

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
  ])(
    "ratelimit handler tests: %i requests with %i maxLimit",
    async (requestCount, maxRequests) => {

      await client.flushAll();

      const req = {
        ip: "127.0.0.1",
      } as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        setHeader: jest.fn(),
      } as unknown as Response;

      const next = jest.fn();

      const middleware = rateLimitHandler({
        client: client,
        maxRequests: maxRequests,
        durationInSec: 60,     
        keyPrefix: "test-key",
        enableHeaders: false,
      });

      for (let i = 1; i <= requestCount; i++) {
        await middleware(req, res, next);
      }

      expect(next).toHaveBeenCalledTimes(
        Math.min(requestCount, maxRequests)
      );
    }
  );
});