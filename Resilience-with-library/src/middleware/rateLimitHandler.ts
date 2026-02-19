import { NextFunction, Request, Response } from "express";
import client from "../config/redis";
import { RateLimiterRedis } from "rate-limiter-flexible";

type rateLimitOptions = {
  maxRequests: number;
  durationInSec?: number;
};

export const rateLimitHandler =
  ({ maxRequests, durationInSec = 60 }: rateLimitOptions) =>
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
