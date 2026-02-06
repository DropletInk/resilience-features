import { Router } from "express";
import { Request, Response } from "express";
import { retryHandler } from "../middleware/retryHandler.js";
// import { retryTest } from "../controller/testing.controller";
// import { testTimeout } from "../controller/testing.controller.js";

const router = Router();

// router.get("/retry-test", async (req: Request, res: Response) => {
//   try {
//     const result = await retryHandler(retryTest);
//     res.send(result);
//   } catch (error: any) {
//     res.send(error.message);
//   }
// });

// router.get("/timeout-test", testTimeout);

export default router;
