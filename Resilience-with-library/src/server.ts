import dotenv from "dotenv";
dotenv.config();
import client from "./config/redis";
import app from "./app";

async () => {
  await client.connect();
};

app.listen(process.env.PORT, () => {
  console.log(`App is running on port ${process.env.PORT}`);
});
