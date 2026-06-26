"use client";

import { useEffect, useState } from "react";
import { getLinksByUsername } from "../api/profile.api";

function useProfileLinks(username) {
    const [links, setLinks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchLinks() {
            try {
                const response = await getLinksByUsername(username);
                setLinks(response.data);
            } catch (err) {
                setError(err?.response?.data?.message || "Failed to load links");
            } finally {
                setIsLoading(false);
            }
        }
        fetchLinks();
    }, [username]);

    return { links, isLoading, error };
}

export default useProfileLinks;
