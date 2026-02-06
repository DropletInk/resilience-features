import { retryHandler } from "../middleware/retryHandler";

let count = 0;

export const retryTest = async () => {
  count++;

  console.log(`Attempt Number: ${count}`);

  if (count < 3) {
    throw new Error("Process failed, retrying...");
  }

  console.log("Success after retries");
  return "Retry handler test successful";
};
retryHandler(retryTest);
