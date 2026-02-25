"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRedisClient = void 0;
const redis_1 = require("redis");
const createRedisClient = (options) => {
    const client = (0, redis_1.createClient)(options);
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
exports.createRedisClient = createRedisClient;
