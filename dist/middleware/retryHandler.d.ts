type RetryOptions<T> = {
    fn: () => Promise<T>;
    maxRetry: number;
    iniDelay?: number;
    exBackoffMultiplier?: number;
};
export declare const retryHandler: <T>({ fn, maxRetry, iniDelay, exBackoffMultiplier, }: RetryOptions<T>) => Promise<T>;
export {};
