"use client";

import { useState, useEffect } from "react";
import useDebounce from "@/features/shared/hooks/useDebounce";
import { checkUsername } from "@/features/auth/api/auth.api";

const RESERVED_USERNAMES = [
    "admin", "api", "login", "signup", "auth", "dashboard",
    "settings", "profile", "user", "users", "link", "links",
    "clicks", "analytics", "health", "test", "root", "system",
];

function validateUsernameFormat(username) {
    if (username.length < 3 || username.length > 20) {
        return "Username must be 3-20 characters long";
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        return "Username must be alphanumeric only";
    }
    if (RESERVED_USERNAMES.includes(username.toLowerCase())) {
        return "This username is reserved";
    }
    return null;
}

function useUsernameCheck(username) {
    const [result, setResult] = useState("idle");
    const [isChecking, setIsChecking] = useState(false);
    const debouncedUsername = useDebounce(username, 500);
    const isActive = debouncedUsername && debouncedUsername.trim().length >= 3;
    const formatError = isActive ? validateUsernameFormat(debouncedUsername.trim()) : null;
    const shouldCheck = isActive && !formatError;

    useEffect(() => {
        if (!shouldCheck) {
            return;
        }

        let cancelled = false;

        async function check() {
            setIsChecking(true);
            try {
                const response = await checkUsername(debouncedUsername.trim());
                if (!cancelled) {
                    setResult(response.data.available ? "available" : "taken");
                }
            } catch {
                if (!cancelled) {
                    setResult("idle");
                }
            } finally {
                if (!cancelled) {
                    setIsChecking(false);
                }
            }
        }

        check();

        return () => {
            cancelled = true;
        };
    }, [debouncedUsername, shouldCheck]);

    if (!isActive) return { status: "idle", formatError: "" };
    if (formatError) return { status: "invalid", formatError };
    if (isChecking) return { status: "checking", formatError: "" };
    return { status: result, formatError: "" };
}

export default useUsernameCheck;
