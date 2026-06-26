"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { createLink } from "../api/link.api";

const LINK_FORM_INITIAL_STATE = {
    title: "",
    url: "",
};

const PLATFORM_COLORS = {
    youtube: "#FF0000", instagram: "#E4405F", x: "#000000", twitter: "#000000",
    facebook: "#1877F2", telegram: "#26A5E4", reddit: "#FF4500", github: "#333333",
    linkedin: "#0A66C2", discord: "#5865F2", tiktok: "#000000", spotify: "#1DB954",
    twitch: "#9146FF", threads: "#000000", pinterest: "#BD081C", whatsapp: "#25D366",
    medium: "#000000", dribbble: "#EA4C89",
};

function getPlatformFromUrl(url) {
    try {
        const hostname = new URL(url).hostname.toLowerCase().replace("www.", "");
        const map = {
            "youtube.com": "youtube", "youtu.be": "youtube", "instagram.com": "instagram",
            "twitter.com": "twitter", "x.com": "x", "facebook.com": "facebook",
            "fb.com": "facebook", "telegram.org": "telegram", "t.me": "telegram",
            "reddit.com": "reddit", "github.com": "github", "linkedin.com": "linkedin",
            "discord.com": "discord", "tiktok.com": "tiktok", "spotify.com": "spotify",
            "twitch.tv": "twitch", "threads.net": "threads", "dribbble.com": "dribbble",
            "medium.com": "medium", "pinterest.com": "pinterest",
            "wa.me": "whatsapp", "whatsapp.com": "whatsapp",
        };
        for (const [domain, platform] of Object.entries(map)) {
            if (hostname.includes(domain)) return platform;
        }
    } catch {}
    return null;
}

function getApiErrorMessage(error) {
    return error?.response?.data?.message || error.message || "Something went wrong";
}

function useLinkForm() {
    const [form, setForm] = useState(LINK_FORM_INITIAL_STATE);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleInputChange(event) {
        const { name, value } = event.target;
        setForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const platform = getPlatformFromUrl(form.url);
            const borderColor = platform ? PLATFORM_COLORS[platform] : "#4f46e5";

            await createLink({
                title: form.title,
                url: form.url,
                borderColor,
            });
            toast.success("Link created successfully");
            setForm(LINK_FORM_INITIAL_STATE);
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    }

    return {
        form,
        isSubmitting,
        handleInputChange,
        setForm,
        handleSubmit,
    };
}

export default useLinkForm;
