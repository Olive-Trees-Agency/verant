/**
 * Debounces a function call so that the `callback` function will only be called after the `timeout` has passed. Each time the function is called before the timeout has passed, the timeout will be reset.
 * @param callback Callback function to be called when debounce completes.
 * @param timeout The debouncing timeout in milliseconds.
 */
export const debounce = (callback: CallableFunction, timeout: number) => {
    let timer: number;
    return function (event: unknown) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => callback(), timeout, event);
    };
};
