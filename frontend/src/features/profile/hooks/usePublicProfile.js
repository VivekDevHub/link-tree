"use client";

import { useEffect, useState } from "react";
import { getPublicProfile } from "@/features/auth/api/auth.api";

function usePublicProfile(username) {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!username) return;

        async function fetchProfile() {
            try {
                const response = await getPublicProfile(username);
                setProfile(response.data);
            } catch {
                setProfile(null);
            } finally {
                setIsLoading(false);
            }
        }

        fetchProfile();
    }, [username]);

    return { profile, isLoading };
}

export default usePublicProfile;
