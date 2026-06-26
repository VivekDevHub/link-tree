"use client";

import { useState, useEffect, useCallback } from "react";

function useCountdown(initialSeconds) {
    const [seconds, setSeconds] = useState(initialSeconds || 0);

    const isActive = seconds > 0;

    useEffect(() => {
        if (!isActive) return;

        const interval = setInterval(() => {
            setSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive]);

    const start = useCallback((value) => {
        setSeconds(value);
    }, []);

    const reset = useCallback(() => {
        setSeconds(0);
    }, []);

    return { seconds, start, reset, isActive };
}

export default useCountdown;
