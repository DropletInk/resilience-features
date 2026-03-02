import { NextFunction, Request, Response } from "express";
import { RateLimiterRedis, RateLimiterMemory } from "rate-limiter-flexible";
import { createRedisClient } from "../config/redis.js";

type RedisClient = ReturnType<typeof createRedisClient>;

type rateLimitOptions = {
  client: RedisClient;
  maxRequests: number;
  durationInSec: number;
  blockDurationInSec?: number;
  keyPrefix: string;
  keyGenerator?: (req: Request) => string;
  execEvenly?: boolean;
  inMemoryBlockOnConsumed?: number;
  enableHeaders?: boolean;
  enableInsuranceLimiter?: boolean;
};

export const rateLimitHandler = ({
  client,
  maxRequests,
  durationInSec,
  blockDurationInSec = 0,
  keyPrefix,
  keyGenerator = (req) => {
    const ip = req.ip ?? "unknown-ip";
    const username = (req as any).user?.username ?? "unknown-user";
    const method = req.method ?? "unknown-metod";
    const endpoint = req.path ?? "unknown-endpoints";
    return `${ip}:${username}:${method}:${endpoint}`;
  },
  execEvenly = false,
  inMemoryBlockOnConsumed,
  enableHeaders = false,
  enableInsuranceLimiter = false,
}: rateLimitOptions) => {
  const memoryFallback = enableInsuranceLimiter
    ? new RateLimiterMemory({
        points: maxRequests,
        duration: durationInSec,
      })
    : undefined;

  const rateLimiter = new RateLimiterRedis({
    storeClient: client,
    points: maxRequests,
    duration: durationInSec,
    blockDuration: blockDurationInSec,
    keyPrefix,
    execEvenly,
    inMemoryBlockOnConsumed: inMemoryBlockOnConsumed ?? maxRequests,
    insuranceLimiter: memoryFallback,
  });
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = keyGenerator(req);

      const result = await rateLimiter.consume(key);

      console.log("Key: ", key);
      console.log(`Request passed ${result.consumedPoints} times`);
      if (enableHeaders) {
        res.setHeader("RateLimit-limit", maxRequests);
        res.setHeader("RateLimit-remaining", result.remainingPoints);
        res.setHeader("Ratelimit-Reset", Math.ceil(result.msBeforeNext / 1000));
      }
      return next();
    } catch (error: any) {
      if (typeof error.msBeforeNext === "number") {
        if (enableHeaders) {
          res.setHeader("Retry-after", Math.ceil(error.msBeforeNext / 1000));
        }
        return res.status(429).json({ message: "Too many requests" });
      }

      console.error("Rate limiter error: ", error);
      return res.status(503).json({ message: "Service Unavailable" });
    }
  };
};
