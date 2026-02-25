"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitHandler = void 0;
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
const rateLimitHandler = ({ client, maxRequests = 5, durationInSec = 60, }) => {
    const rateLimiter = new rate_limiter_flexible_1.RateLimiterRedis({
        storeClient: client,
        points: maxRequests,
        duration: durationInSec,
    });
    return async (req, res, next) => {
        try {
            const result = await rateLimiter.consume(req.ip);
            console.log("IP:", req.ip);
            console.log(`Request passed ${result.consumedPoints} times`);
            next();
        }
        catch (error) {
            // console.error("Rate Limit:", error);
            console.log("Rate limit exceeded");
            res.status(429).json({ message: "Too many requests" });
        }
    };
};
exports.rateLimitHandler = rateLimitHandler;
