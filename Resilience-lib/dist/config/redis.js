import { createClient } from "redis";
// In RedisClientOptions need to pass data like
// socket:
// {
//   host: "localhost",
//   port: 6379
// }
// or, { url: "redis://localhost:6379" }
export const createRedisClient = (options) => {
    const client = createClient(options);
    client.on("error", (err) => {
        console.error("Redis client error", err);
    });
    client.on("connect", () => {
        console.log("Connecting to redis...");
    });
    client.on("ready", () => {
        console.log("Successfully connected to redis");
    });
    return client;
};
