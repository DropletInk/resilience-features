import { NextFunction, Request, Response } from "express";
import client from "../config/redis";
import { RateLimiterRedis } from "rate-limiter-flexible";

export const rateLimitHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
  maxRequests: number = 5,
  durationInSec: number = 60,
) => {
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
    console.error("Rate Limit:", error);
    res.status(429).json({ message: "Too many requests" });
  }
};
