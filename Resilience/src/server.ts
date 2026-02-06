import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import client from "./config/redis.js";

client.connect();

app.listen(process.env.PORT, () => {
  console.log(`App is running on port ${process.env.PORT}`);
});
