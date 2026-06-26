"use client";

import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/features/auth/context/AuthContext";
import { getMySubscription } from "@/features/payments/api/payment.api";
import { updateLinkStyle, highlightLink } from "@/features/premium/api/premium.api";
import { getMyLinks, deleteLink, reorderLinks } from "../../api/link.api";
import { sortByOrder } from "@/features/shared/utils/heapSort";
import styles from "../css/ViewLinks.module.css";

const PLATFORM_ICONS = {
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

function getApiErrorMessage(error) {
    return error?.response?.data?.message || error.message || "Something went wrong";
}

function ViewLinks() {
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";
    const [links, setLinks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
    const isPremium = isAdmin || hasActiveSubscription;
    const [dragIndex, setDragIndex] = useState(null);
    const [styleModal, setStyleModal] = useState(null);
    const [colorValue, setColorValue] = useState("#4f46e5");
    const [iconValue, setIconValue] = useState("");
    const dragItem = useRef(null);
    const dragOverItem = useRef(null);

    useEffect(() => {
        if (isAdmin) return;

        getMySubscription().then((sub) => {
            setHasActiveSubscription(sub?.status === "active");
        }).catch(() => {
            setHasActiveSubscription(false);
        });
    }, [isAdmin]);

    useEffect(() => {
        async function loadLinks() {
            try {
                const response = await getMyLinks();
                setLinks(sortByOrder(response.data));
            } catch (error) {
                toast.error(getApiErrorMessage(error));
            } finally {
                setIsLoading(false);
            }
        }
        loadLinks();
    }, []);

    function openColorModal(link) {
        setColorValue(link.borderColor || "#4f46e5");
        setStyleModal({ type: "color", link });
    }

    function openIconModal(link) {
        setIconValue(link.customIcon || "");
        setStyleModal({ type: "icon", link });
    }

    function closeStyleModal() {
        setStyleModal(null);
    }

    async function handleSoftDelete(linkId) {
        try {
            await deleteLink(linkId);
            setLinks((prev) => prev.filter((link) => link._id !== linkId));
            toast.success("Link deleted");
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        }
    }

    async function handleColorSave() {
        if (!isPremium || !styleModal?.link) return;

        try {
            await updateLinkStyle(styleModal.link._id, { borderColor: colorValue });
            setLinks((prev) => prev.map((l) => l._id === styleModal.link._id ? { ...l, borderColor: colorValue } : l));
            closeStyleModal();
            toast.success("Border color updated");
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        }
    }

    async function handleIconSave() {
        if (!isPremium || !styleModal?.link) return;

        const nextIcon = iconValue.trim();
        if (nextIcon) {
            try {
                new URL(nextIcon);
            } catch {
                toast.error("Enter a valid image URL");
                return;
            }
        }

        try {
            await updateLinkStyle(styleModal.link._id, { customIcon: nextIcon });
            setLinks((prev) => prev.map((l) => l._id === styleModal.link._id ? { ...l, customIcon: nextIcon } : l));
            closeStyleModal();
            toast.success(nextIcon ? "Icon updated" : "Icon removed");
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        }
    }

    async function handleToggleHighlight(linkId, currentStatus) {
        if (!isPremium) return;

        try {
            if (currentStatus) {
                await updateLinkStyle(linkId, { isHighlighted: false, highlightExpiresAt: null });
                setLinks((prev) => prev.map((l) => l._id === linkId ? { ...l, isHighlighted: false, highlightExpiresAt: null } : l));
                toast.success("Highlight removed");
            } else {
                await highlightLink(linkId);
                setLinks((prev) => prev.map((l) => l._id === linkId ? { ...l, isHighlighted: true } : l));
                toast.success("Link highlighted!");
            }
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        }
    }

    function handleDragStart(e, index) {
        dragItem.current = index;
        setDragIndex(index);
        e.dataTransfer.effectAllowed = "move";
    }

    function handleDragOver(e, index) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        dragOverItem.current = index;
    }

    async function handleDrop(e) {
        e.preventDefault();
        const from = dragItem.current;
        const to = dragOverItem.current;
        if (from === null || to === null || from === to) {
            setDragIndex(null);
            return;
        }
        const updated = [...links];
        const [moved] = updated.splice(from, 1);
        updated.splice(to, 0, moved);
        setLinks(updated);
        setDragIndex(null);
        dragItem.current = null;
        dragOverItem.current = null;
        try {
            await reorderLinks(updated.map((link) => link._id));
        } catch (error) {
            toast.error(getApiErrorMessage(error));
            const response = await getMyLinks();
            setLinks(sortByOrder(response.data));
        }
    }

    function handleDragEnd() {
        setDragIndex(null);
        dragItem.current = null;
        dragOverItem.current = null;
    }

    if (isLoading) return <p className={styles.loading}>Loading links...</p>;
    if (links.length === 0) return <p className={styles.empty}>No links yet. Add one!</p>;

    return (
        <>
            <div className={styles.container}>
                {links.map((link, index) => {
                    const platform = isPremium ? getPlatformFromUrl(link.url) : null;
                    const favicon = isPremium ? getFaviconUrl(link.url) : null;
                    const platformColor = platform ? PLATFORM_ICONS[platform] : null;
                    const borderCol = isPremium ? (link.borderColor || "#e0e0e0") : "#e0e0e0";

                    return (
                        <div
                            key={link._id}
                            className={`${styles.card} ${dragIndex === index ? styles.dragging : ""}`}
                            style={{ borderLeft: `4px solid ${borderCol}` }}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDrop={handleDrop}
                            onDragEnd={handleDragEnd}
                        >
                            <div className={styles.handle} title="Drag to reorder">
                                &#9776;
                            </div>
                            <span className={styles.sr}>{index + 1}</span>

                            {link.customIcon ? (
                                <img src={link.customIcon} alt="" width={20} height={20} onError={(event) => handleFaviconError(event, link.url)} style={{ borderRadius: 4, flexShrink: 0, objectFit: "cover" }} />
                            ) : favicon ? (
                                <img src={favicon} alt="" width={20} height={20} onError={(event) => handleFaviconError(event, link.url)} style={{ borderRadius: 4, flexShrink: 0 }} />
                            ) : platformColor ? (
                                <div style={{
                                    width: 20, height: 20, borderRadius: 4, flexShrink: 0,
                                    background: platformColor, display: "flex",
                                    alignItems: "center", justifyContent: "center",
                                    color: "#fff", fontSize: 10, fontWeight: 700,
                                }}>
                                    {(platform || "?")[0].toUpperCase()}
                                </div>
                            ) : null}

                            <div className={styles.info}>
                                <h3 className={styles.title}>{link.title}</h3>
                                <p className={styles.url}>{link.url}</p>
                            </div>

                            <div className={styles.actions}>
                                {isPremium && (
                                    <>
                                        <button
                                            onClick={() => handleToggleHighlight(link._id, link.isHighlighted)}
                                            className={styles.featureBtn}
                                            style={link.isHighlighted ? { background: "#f59e0b", color: "#fff" } : undefined}
                                            title={link.isHighlighted ? "Remove highlight" : "Highlight this link"}
                                        >
                                            {link.isHighlighted ? "Featured" : "Feature"}
                                        </button>
                                        <button onClick={() => openIconModal(link)} className={styles.iconBtn} title="Change icon image URL">
                                            Icon
                                        </button>
                                        <button
                                            onClick={() => openColorModal(link)}
                                            className={styles.colorBtn}
                                            style={{ background: borderCol, borderColor: borderCol }}
                                            title="Change border color"
                                        />
                                    </>
                                )}
                                <button className={styles.deleteBtn} onClick={() => handleSoftDelete(link._id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {styleModal && (
                <div className={styles.modalOverlay} onClick={closeStyleModal}>
                    <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
                        <button className={styles.modalClose} onClick={closeStyleModal}>x</button>
                        <h3 className={styles.modalTitle}>
                            {styleModal.type === "icon" ? "Change Icon" : "Change Color"}
                        </h3>
                        <p className={styles.modalSubtitle}>{styleModal.link.title}</p>

                        {styleModal.type === "icon" ? (
                            <>
                                <label className={styles.modalLabel} htmlFor="customIcon">Image URL</label>
                                <input
                                    id="customIcon"
                                    type="url"
                                    value={iconValue}
                                    onChange={(event) => setIconValue(event.target.value)}
                                    placeholder="https://example.com/icon.png"
                                    className={styles.modalInput}
                                />
                                <div className={styles.modalActions}>
                                    <button className={styles.secondaryBtn} onClick={() => setIconValue("")}>Clear</button>
                                    <button className={styles.primaryBtn} onClick={handleIconSave}>Save Icon</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <label className={styles.modalLabel} htmlFor="borderColor">Border Color</label>
                                <div className={styles.colorPickerRow}>
                                    <input
                                        id="borderColor"
                                        type="color"
                                        value={colorValue}
                                        onChange={(event) => setColorValue(event.target.value)}
                                        className={styles.modalColorInput}
                                    />
                                    <input
                                        type="text"
                                        value={colorValue}
                                        onChange={(event) => setColorValue(event.target.value)}
                                        className={styles.modalInput}
                                    />
                                </div>
                                <div className={styles.modalActions}>
                                    <button className={styles.secondaryBtn} onClick={closeStyleModal}>Cancel</button>
                                    <button className={styles.primaryBtn} onClick={handleColorSave}>Save Color</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default ViewLinks;


