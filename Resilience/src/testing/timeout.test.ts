import { timeoutHandler } from "../middleware/timeoutHandler";

timeoutHandler(async () => {
  await new Promise((r) => setTimeout(r, 11000));
  ("Completed before timeout");
});
