import { NextFunction, Request, Response } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import { createRedisClient } from "../config/redis.js";

type RedisClient = ReturnType<typeof createRedisClient>;

type rateLimitOptions = {
  client: RedisClient;
  maxRequests?: number;
  durationInSec?: number;
};

export const rateLimitHandler = ({
  client,
  maxRequests = 5,
  durationInSec = 60,
}: rateLimitOptions) => {
  const rateLimiter = new RateLimiterRedis({
    storeClient: client,
    points: maxRequests,
    duration: durationInSec,
  });
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await rateLimiter.consume(req.ip!);

      console.log("IP:", req.ip);
      console.log(`Request passed ${result.consumedPoints} times`);
      next();
    } catch (error) {
      // console.error("Rate Limit:", error);
      console.log("Rate limit exceeded");
      res.status(429).json({ message: "Too many requests" });
    }
  };
};
