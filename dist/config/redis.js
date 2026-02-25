import { createClient } from "redis";
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
