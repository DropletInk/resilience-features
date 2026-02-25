import { NextFunction, Request, Response } from "express";
import { createRedisClient } from "../config/redis";
type RedisClient = ReturnType<typeof createRedisClient>;
type rateLimitOptions = {
    client: RedisClient;
    maxRequests: number;
    durationInSec?: number;
};
export declare const rateLimitHandler: ({ client, maxRequests, durationInSec }: rateLimitOptions) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export {};
