"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { getMySubscription } from "@/features/payments/api/payment.api";
import useLinkForm from "../../hooks/useLinkForm";
import styles from "../css/DashboardForm.module.css";

const PLATFORM_COLORS = {
    youtube: "#FF0000",
    instagram: "#E4405F",
    x: "#000000",
    twitter: "#000000",
    facebook: "#1877F2",
    telegram: "#26A5E4",
    reddit: "#FF4500",
    github: "#333333",
    linkedin: "#0A66C2",
    discord: "#5865F2",
    tiktok: "#000000",
    spotify: "#1DB954",
    twitch: "#9146FF",
    threads: "#000000",
    pinterest: "#BD081C",
    whatsapp: "#25D366",
    medium: "#000000",
    dribbble: "#EA4C89",
};

function getPlatformFromUrl(url) {
    try {
        const hostname = new URL(url).hostname.toLowerCase().replace("www.", "");
        const map = {
            "youtube.com": "youtube", "youtu.be": "youtube",
            "instagram.com": "instagram", "twitter.com": "twitter",
            "x.com": "x", "facebook.com": "facebook", "fb.com": "facebook",
            "telegram.org": "telegram", "t.me": "telegram",
            "reddit.com": "reddit", "github.com": "github",
            "linkedin.com": "linkedin", "discord.com": "discord",
            "tiktok.com": "tiktok", "spotify.com": "spotify",
            "twitch.tv": "twitch", "threads.net": "threads",
            "dribbble.com": "dribbble", "medium.com": "medium",
            "pinterest.com": "pinterest", "wa.me": "whatsapp",
            "whatsapp.com": "whatsapp",
        };
        for (const [domain, platform] of Object.entries(map)) {
            if (hostname.includes(domain)) return platform;
        }
    } catch {}
    return null;
}

function getFaviconUrl(url) {
    try {
        const parsedUrl = new URL(url);
        return `${parsedUrl.origin}/favicon.ico`;
    } catch {
        return null;
    }
}

function getFallbackFaviconUrl(url) {
    try {
        return `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(url)}&sz=64`;
    } catch {
        return null;
    }
}

function handleFaviconError(event, url) {
    const fallback = getFallbackFaviconUrl(url);
    if (fallback && event.currentTarget.src !== fallback) {
        event.currentTarget.src = fallback;
        return;
    }
    event.currentTarget.style.display = "none";
}

function DashboardForm() {
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";
    const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
    const isPremium = isAdmin || hasActiveSubscription;
    const {
        form,
        isSubmitting,
        handleInputChange,
        handleSubmit,
    } = useLinkForm();

    useEffect(() => {
        if (isAdmin) return;

        getMySubscription().then((sub) => {
            setHasActiveSubscription(sub?.status === "active");
        }).catch(() => {
            setHasActiveSubscription(false);
        });
    }, [isAdmin]);

    const platform = isPremium && form.url ? getPlatformFromUrl(form.url) : null;
    const favicon = isPremium && form.url ? getFaviconUrl(form.url) : null;
    const platformColor = platform ? PLATFORM_COLORS[platform] : "#e0e0e0";

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Add New Link</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="title">Title</label>
                    <input
                        className={styles.input}
                        id="title"
                        name="title"
                        type="text"
                        placeholder="My awesome link"
                        value={form.title}
                        onChange={handleInputChange}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="url">URL</label>
                    <input
                        className={styles.input}
                        id="url"
                        name="url"
                        type="url"
                        placeholder="https://example.com"
                        value={form.url}
                        onChange={handleInputChange}
                    />
                </div>

                {isPremium && form.url && (
                    <div className={styles.field}>
                        <label className={styles.label}>Preview</label>
                        <div style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "10px 14px", border: `2px solid ${platformColor}`,
                            borderRadius: 8, background: "#fff",
                        }}>
                            {favicon ? (
                                <img src={favicon} alt="" width={20} height={20} onError={(event) => handleFaviconError(event, form.url)} style={{ borderRadius: 4 }} />
                            ) : (
                                <div style={{
                                    width: 20, height: 20, borderRadius: 4,
                                    background: "#e2e8f0", display: "flex",
                                    alignItems: "center", justifyContent: "center",
                                    fontSize: 10, color: "#94a3b8",
                                }}>?</div>
                            )}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: 14, fontWeight: 600, color: "#101b31", margin: 0 }}>
                                    {form.title || "Link title"}
                                </p>
                                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {form.url}
                                </p>
                            </div>
                            {platform && (
                                <span style={{
                                    fontSize: 11, fontWeight: 600, color: platformColor,
                                    background: `${platformColor}15`, padding: "2px 8px",
                                    borderRadius: 10, whiteSpace: "nowrap",
                                }}>
                                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                <button
                    className={styles.button}
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Creating..." : "Create Link"}
                </button>
            </form>
        </div>
    );
}

export default DashboardForm;




