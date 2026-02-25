import { RateLimiterRedis } from "rate-limiter-flexible";
export const rateLimitHandler = ({ client, maxRequests, durationInSec = 60, }) => {
    const rateLimiter = new RateLimiterRedis({
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
