let listeners = [];

export function emitRateLimit(seconds) {
    listeners.forEach((fn) => fn(seconds));
}

export function onRateLimit(fn) {
    listeners.push(fn);
    return () => {
        listeners = listeners.filter((l) => l !== fn);
    };
}
