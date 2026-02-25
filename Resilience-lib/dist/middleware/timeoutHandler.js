import pTimeout from "p-timeout";
export const timeoutHandler = ({ fn, time }) => {
    return pTimeout(fn(), {
        milliseconds: time,
    });
};
