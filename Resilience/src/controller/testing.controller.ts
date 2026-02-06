// import { Request, Response } from "express";
// import { timeoutHandler } from "../middleware/timeoutHandler.js";
// import { retryHandler } from "../middleware/retryHandler.js";

// let count = 0;

// export const retryTest = async () => {
//   count++;
//   console.log("Count No:", count);

//   if (count < 7) {
//     throw Error("process failed now");
//   } else {
//     console.log("successs");
//     return "Retry handler checking succeed";
//   }
// };

// export const testTimeout = async (req: Request, res: Response) => {
//   try {
//     const result = await timeoutHandler(async () => {
//       await new Promise((r) => setTimeout(r, 3000));
//       return "Completed before timeout";
//     });

//     res.send(result);
//   } catch (error: any) {
//     res.send(error.message);
//   }
// };
