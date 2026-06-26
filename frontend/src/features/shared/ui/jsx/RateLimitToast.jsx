"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";
import useCountdown from "../hooks/useCountdown";
import { onRateLimit } from "@/lib/rateLimitEvents";

function RateLimitToast() {
    const { seconds, start, isActive } = useCountdown(0);

    useEffect(() => {
        return onRateLimit((secs) => {
            start(secs);
        });
    }, [start]);

    useEffect(() => {
        if (isActive) {
            toast.error(`Too many requests. Try again in ${seconds} seconds.`, {
                toastId: "rate-limit",
                autoClose: false,
                closeOnClick: false,
            });
        } else if (seconds === 0) {
            toast.dismiss("rate-limit");
        }
    }, [seconds, isActive]);

    return null;
}

export default RateLimitToast;
