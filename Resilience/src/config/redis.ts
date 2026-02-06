import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();
const client = createClient({
  username: "default",
  password: process.env.REDIS_PASS,
  socket: {
    host: "redis-18381.crce206.ap-south-1-1.ec2.cloud.redislabs.com",
    port: 18381,
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
