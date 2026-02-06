import { timeoutHandler } from "../middleware/timeoutHandler";

timeoutHandler(async () => {
  await new Promise((r) => setTimeout(r, 6000));
  ("Completed before timeout");
});
