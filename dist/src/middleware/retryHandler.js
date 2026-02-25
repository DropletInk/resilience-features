"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retryHandler = void 0;
const p_retry_1 = __importDefault(require("p-retry"));
const retryHandler = async ({ fn, maxRetry = 3, iniDelay = 1000, exBackoffMultiplier = 2, }) => {
    try {
        const result = await (0, p_retry_1.default)(async () => {
            return await fn();
        }, {
            retries: maxRetry,
            factor: exBackoffMultiplier,
            minTimeout: iniDelay,
            onFailedAttempt: (error) => {
                if (error.retriesLeft === 0) {
                    console.log("Retry limit exceeded");
                    return;
                }
                const delay = iniDelay * exBackoffMultiplier ** (error.attemptNumber - 1);
                console.log(`Attempt failed. Retrying in ${Math.round(delay / 1000)}s`);
            },
        });
        console.log("Success");
        return result;
    }
    catch (error) {
        console.log("Request failed after retries");
        throw error;
    }
};
exports.retryHandler = retryHandler;
