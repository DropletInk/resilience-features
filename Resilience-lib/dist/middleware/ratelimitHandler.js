import { RateLimiterRedis } from "rate-limiter-flexible";
export const rateLimitHandler = ({ client, maxRequests, durationInSec = 60 }) => async (req, res, next) => {
    try {
        const rateLimiter = new RateLimiterRedis({
            storeClient: client,
            points: maxRequests,
            duration: durationInSec,
        });
        const res = await rateLimiter.consume(req.ip);
        console.log("IP:", req.ip);
        console.log(`Request passed ${res.consumedPoints} times`);
        next();
    }
    catch (error) {
        // console.error("Rate Limit:", error);
        console.log("Rate limit exceeded");
        res.status(429).json({ message: "Too many requests" });
    }
};
