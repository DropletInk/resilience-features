import pTimeout from "p-timeout";

type TimeoutOptions<T> = {
  fn: () => Promise<T>;
  time: number;
};

export const timeoutHandler = <T>({
  fn,
  time,
}: TimeoutOptions<T>) => {
  return pTimeout(fn(), {
    milliseconds: time,
  });
};