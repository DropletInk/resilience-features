import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();
const client = createClient({
  socket: {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT),
  },
});

client.on("error", (err) => {
  console.error("Redis client error", err);
});

client.on("connect", () => {
  console.log("Connecting to redis...");
});

client.on("ready", () => {
  console.log("Successfully connected to redis");
});


export default client;