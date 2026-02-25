type TimeoutOptions<T> = {
    fn: () => Promise<T>;
    time: number;
};
export declare const timeoutHandler: <T>({ fn, time, }: TimeoutOptions<T>) => import("p-timeout").ClearablePromise<T>;
export {};
