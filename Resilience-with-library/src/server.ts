import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import client from "./config/redis";

client.connect();

app.listen(process.env.PORT, () => {
  console.log(`App is running on port ${process.env.PORT}`);
});
