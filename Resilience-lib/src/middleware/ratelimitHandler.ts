import { NextFunction, Request, Response } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import { createRedisClient } from "../config/redis";

type RedisClient = ReturnType<typeof createRedisClient>;

type rateLimitOptions = {
  client: RedisClient;
  maxRequests: number;
  durationInSec?: number;
};

export const rateLimitHandler =
  ({client, maxRequests, durationInSec = 60 }: rateLimitOptions) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rateLimiter = new RateLimiterRedis({
        storeClient: client,
        points: maxRequests,
        duration: durationInSec,
      });
      const res = await rateLimiter.consume(req.ip!);

      console.log("IP:", req.ip);
      console.log(`Request passed ${res.consumedPoints} times`);
      next();
    } catch (error) {
      // console.error("Rate Limit:", error);
      console.log("Rate limit exceeded")
      res.status(429).json({ message: "Too many requests" });
    }
  };