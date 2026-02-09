import { Request, Response, NextFunction } from "express";
import client from "../config/redis.js";

export const rateLimitHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
  windowSize: number = 60,
  maxRequests: number = 5,
) => {
  try {
    const ip = req.ip;
    const key = `rate-limit:${ip}`;
    const now = Date.now();
    const windowSizeInms = windowSize * 1000;
    // const maxRequests = 5;

    await client.zAdd(key, [{ score: now, value: now.toString() }]);

    await client.zRemRangeByScore(key, 0, now - windowSizeInms);

    const count = await client.zCard(key);

    await client.expire(key, 60);

    if (count > maxRequests) {
      console.log("Too many requests");
      return res.status(429).json({
        message: "Too many requests, try later",
      });
    }


    next();
  } catch (err) {
    console.error("Rate limiter error:", err);
    next();
  }
};
