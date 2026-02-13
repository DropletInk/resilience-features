import { retryHandler } from "../middleware/retryHandler";

let count = 0;

export const retryTest = async () => {
  count++;

  console.log(`Attempt Number: ${count}`);

  if (count < 2) {
    throw new Error("Request failed, retrying limit exceeded");
  }

  console.log("Test successful");
  return "Retry handler test successful";
};
retryHandler(retryTest);
