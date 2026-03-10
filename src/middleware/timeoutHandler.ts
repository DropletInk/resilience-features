import pTimeout from "p-timeout";

type TimeoutOptions<T> = {
  fn: () => Promise<T>;
  time?: number;
};

export const basicTimeoutHandler = async <T>({
  fn,
  time = 20000,
}: TimeoutOptions<T>) => {
  return pTimeout(fn(), {
    milliseconds: time,
  });
};

export const advancedTimeoutHandler = async <T>(
  options: {
    fn: () => Promise<T>;
  } & Parameters<typeof pTimeout>[1],
): Promise<T> => {
  const { fn, ...advancedTimeoutOptions } = options;

  return pTimeout(fn(), advancedTimeoutOptions) as Promise<T>;
};
