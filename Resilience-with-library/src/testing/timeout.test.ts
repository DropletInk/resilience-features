import { timeoutHandler } from "../middleware/timeoutHandler";

try {
  await timeoutHandler(async () => {
    await new Promise((r) => setTimeout(r, 12000));
    console.log("Request completed before timeout");
  }, 10000);
} catch (error: any) {
  console.log("Timeout Error:", error.message);
  process.exit();
  
}
