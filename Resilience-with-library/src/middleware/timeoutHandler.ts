import pTimeout from "p-timeout";

type timeoutOptions<T> = {
  fn: () => Promise<T>;
  time: number;
};

export const timeoutHandler = async <T>({
  fn,
  time,
}: timeoutOptions<T>) => {
  return await pTimeout(fn(), time);
};
