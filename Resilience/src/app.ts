import express from "express";
import testRoutes from "./routes/testRoutes.js";
import { rateLimitHandler } from "./middleware/rateLimitHandling.js";

const app = express();

app.use(express.json());

app.use(rateLimitHandler);

app.get("/user", (req, res) => {
  res.send("User fetched successfully");
});

app.use("/test", testRoutes);

export default app;
