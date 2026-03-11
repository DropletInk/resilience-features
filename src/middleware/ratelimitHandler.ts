import { NextFunction, Request, Response } from "express";
import {
  RateLimiterRedis,
  RateLimiterMemory,
  RateLimiterMongo,
} from "rate-limiter-flexible";
import { createClient } from "redis";

type RedisClient = ReturnType<typeof createClient>;

type rateLimitOptions = {
  rateLimiter: RateLimiterRedis | RateLimiterMemory | RateLimiterMongo;
  keyGenerator?: (req: Request) => string;
  enableHeaders?: boolean;
};

type BasicRedisOptions = {
  client: RedisClient;
  points?: number;
  duration?: number;
  blockDuration?: number;
  keyPrefix?: string;
  execEvenly?: boolean;
};

export const RateLimiterFactory = {
  basicRedis: ({
    client,
    points = 5,
    duration = 60,
    blockDuration = 0,
    keyPrefix = "rate-limit",
    execEvenly = false,
  }: BasicRedisOptions): RateLimiterRedis => {
    return new RateLimiterRedis({
      storeClient: client,
      useRedisPackage: true,
      points,
      duration,
      blockDuration,
      keyPrefix,
      execEvenly,
    });
  },

  advancedRedis: (
    options: ConstructorParameters<typeof RateLimiterRedis>[0],
  ): RateLimiterRedis => {
    return new RateLimiterRedis(options);
  },

  inMemoryLimiter: (
    options: ConstructorParameters<typeof RateLimiterMemory>[0],
  ): RateLimiterMemory => {
    return new RateLimiterMemory(options);
  },

  mongoLimiter: (
    options: ConstructorParameters<typeof RateLimiterMongo>[0],
  ): RateLimiterMongo => {
    return new RateLimiterMongo(options);
  },
};

export const rateLimitHandler = ({
  rateLimiter,
  enableHeaders = false,
  keyGenerator = (req: Request) => {
    const ip = req.ip ?? "unknown-ip";
    const username =
      req.body?.email ||
      req.body?.username ||
      "unknown-user";
    const method = req.method ?? "unknown-method";
    const endpoint = req.path ?? "unknown-endpoints";
    return `${ip}:${username}:${method}:${endpoint}`;
  },
}: rateLimitOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = keyGenerator(req);

      const result = await rateLimiter.consume(key);

      if (enableHeaders) {
        res.setHeader("RateLimit-Limit", rateLimiter.points);
        res.setHeader("RateLimit-Remaining", result.remainingPoints);
        res.setHeader("RateLimit-Reset", Math.ceil(result.msBeforeNext / 1000));
      }

      console.log("Key: ", key);
      console.log(`Request passed ${result.consumedPoints} times`);

      next();
    } catch (error: unknown) {
      const err = error as { msBeforeNext?: number };
      if (typeof err.msBeforeNext === "number") {
        if (enableHeaders) {
          res.setHeader("Retry-After", Math.ceil(err.msBeforeNext / 1000));
        }
        return res.status(429).json({ message: "Too many requests" });
      }
      console.error("Rate limiter error: ", error);
      return res.status(503).json({ message: "Service Unavailable" });
    }
  };
};
