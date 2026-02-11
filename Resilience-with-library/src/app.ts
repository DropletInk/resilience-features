import express from "express";
import { rateLimitHandler } from "./middleware/rateLimitHandler";
const app = express();

app.use(express.json());
app.use(rateLimitHandler);
app.get("/user", async (req, res) => {
     res.send("User fetched successfully")

});

export default app;
