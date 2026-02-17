import pTimeout from "p-timeout";

export const timeoutHandler = async (
  fn: () => Promise<unknown>,
  time: number = 5000,
) => {
  return await pTimeout(fn(),time);
};
