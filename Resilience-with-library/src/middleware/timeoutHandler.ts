import pTimeout from "p-timeout";

export const timeoutHandler = async (
  fn: () => Promise<any>,
  time: number = 5000,
) => {
  return await pTimeout(fn(), {
    milliseconds: time,
    message: `Request Timeout after ${time / 1000} sec `,
  });
};
