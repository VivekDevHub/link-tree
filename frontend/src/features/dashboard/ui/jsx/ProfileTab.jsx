"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { useAuth } from "@/features/auth/context/AuthContext";
import { updateUsername, updateTheme, getImagekitAuth } from "@/features/auth/api/auth.api";
import { updateBrand } from "@/features/premium/api/premium.api";
import { getMySubscription } from "@/features/payments/api/payment.api";
import ProfilePictureUpload from "@/features/auth/ui/jsx/ProfilePictureUpload";
import useUsernameCheck from "@/features/auth/hooks/useUsernameCheck";
import styles from "../css/ProfileTab.module.css";

const PRESET_COLORS = [
    "#ffffff", "#f8f9fa", "#e9ecef", "#dee2e6",
    "#000000", "#212529", "#343a40", "#495057",
    "#4f46e5", "#06b6d4", "#10b981", "#f59e0b",
    "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6",
];

function ProfileTab() {
    const { user, loginUser } = useAuth();
    const [newUsername, setNewUsername] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [bgColor, setBgColor] = useState(user?.bgColor || "#ffffff");
    const [textColor, setTextColor] = useState(user?.textColor || "#333333");
    const [isSavingTheme, setIsSavingTheme] = useState(false);
    const [copied, setCopied] = useState(false);
    const { status: usernameStatus, formatError } = useUsernameCheck(newUsername);
    const qrRef = useRef(null);

    const [removeBranding, setRemoveBranding] = useState(user?.removeLinkterBranding || false);
    const [customName, setCustomName] = useState(user?.customName || "");
    const [customLogo, setCustomLogo] = useState(user?.customLogo || "");
    const [isSavingBrand, setIsSavingBrand] = useState(false);
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);
    const logoInputRef = useRef(null);
    const [isPremium, setIsPremium] = useState(user?.role === "admin");

    useEffect(() => {
        getMySubscription().then((sub) => {
            if (sub && sub.status === "active") setIsPremium(true);
        }).catch(() => {});
    }, []);

    const profileUrl = typeof window !== "undefined"
        ? `${window.location.origin}/${user?.username}`
        : `/${user?.username}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(profileUrl)}`;

    const hasChanged = newUsername.trim() !== "" && newUsername.trim() !== user?.username;
    const canSave = hasChanged && (usernameStatus === "available") && !formatError;
    const themeChanged = bgColor !== (user?.bgColor || "#ffffff") || textColor !== (user?.textColor || "#333333");
    const brandChanged = removeBranding !== (user?.removeLinkterBranding || false)
        || customName !== (user?.customName || "")
        || customLogo !== (user?.customLogo || "");

    async function handleSave() {
        if (!canSave) return;
        setIsSaving(true);
        try {
            const response = await updateUsername(newUsername.trim());
            loginUser(response.data);
            setNewUsername("");
            toast.success("Username updated successfully");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update username");
        } finally {
            setIsSaving(false);
        }
    }

    async function handleSaveTheme() {
        if (!themeChanged) return;
        setIsSavingTheme(true);
        try {
            const response = await updateTheme(bgColor, textColor);
            loginUser(response.data);
            toast.success("Theme updated successfully");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update theme");
        } finally {
            setIsSavingTheme(false);
        }
    }

    async function handleSaveBrand() {
        if (!brandChanged) return;
        setIsSavingBrand(true);
        try {
            await updateBrand({
                customLogo,
                customName,
                removeLinkterBranding: removeBranding,
            });
            loginUser({
                ...user,
                customLogo,
                customName,
                removeLinkterBranding: removeBranding,
            });
            toast.success("Branding updated");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update branding");
        } finally {
            setIsSavingBrand(false);
        }
    }

    async function handleLogoUpload(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image");
            return;
        }
        setIsUploadingLogo(true);
        try {
            const authRes = await getImagekitAuth();
            const { token, expire, publicKey } = authRes.data;
            const formData = new FormData();
            formData.append("file", file);
            formData.append("fileName", `logo-${user.username}-${Date.now()}`);
            formData.append("publicKey", publicKey);
            formData.append("token", token);
            formData.append("expire", expire);
            formData.append("folder", `/brand-logos/${user.username}`);
            const res = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                setCustomLogo(data.url);
                toast.success("Logo uploaded");
            } else {
                toast.error("Upload failed");
            }
        } catch {
            toast.error("Upload failed");
        } finally {
            setIsUploadingLogo(false);
            if (logoInputRef.current) logoInputRef.current.value = "";
        }
    }

    function handleCopy() {
        navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        toast.success("Link copied!");
        setTimeout(() => setCopied(false), 2000);
    }

    async function handleDownload() {
        try {
            const res = await fetch(qrUrl);
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${user?.username}-qr.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success("QR downloaded!");
        } catch {
            toast.error("Download failed");
        }
    }

    function getUsernameHint() {
        if (formatError) return { text: formatError, color: "#ff4757" };
        if (usernameStatus === "checking") return { text: "Checking...", color: "#888" };
        if (usernameStatus === "available") return { text: "Available", color: "#10b981" };
        if (usernameStatus === "taken") return { text: "Already taken", color: "#ff4757" };
        return { text: "", color: "" };
    }

    const hint = getUsernameHint();

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Profile Settings</h2>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Your Public Page</h3>
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
                    <div style={{ textAlign: "center" }}>
                        <div ref={qrRef} style={{ background: "#fff", display: "inline-block", padding: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}>
                            <Image src={qrUrl} alt="Profile QR" width={160} height={160} />
                        </div>
                    </div>
                    <div style={{ flex: "1 1 200px", minWidth: 0 }}>
                        <label style={{ display: "block", fontSize: 13, color: "#64718a", marginBottom: 6 }}>Public Profile URL</label>
                        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                            <input
                                readOnly
                                value={profileUrl}
                                style={{
                                    flex: 1, padding: "10px 12px", border: "1px solid #e2e8f0",
                                    borderRadius: 8, fontSize: 14, color: "#101b31", background: "#f8fafc",
                                    minWidth: 0,
                                }}
                                onClick={(e) => e.target.select()}
                            />
                            <button
                                onClick={handleCopy}
                                style={{
                                    padding: "10px 16px", border: "none", borderRadius: 8,
                                    background: copied ? "#22c55e" : "#4f46e5", color: "#fff",
                                    fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                                }}
                            >
                                {copied ? "Copied!" : "Copy"}
                            </button>
                        </div>
                        <button
                            onClick={handleDownload}
                            style={{
                                padding: "10px 20px", border: "1px solid #e2e8f0", borderRadius: 8,
                                background: "#fff", color: "#101b31", fontSize: 13, fontWeight: 600,
                                cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1v9M4 7l4 4 4-4M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            Download QR
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Profile Picture</h3>
                <div className={styles.pfpRow}>
                    <ProfilePictureUpload />
                </div>
            </div>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Change Username</h3>
                <div className={styles.inputRow}>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder={user?.username}
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                    />
                    <button
                        className={styles.saveBtn}
                        onClick={handleSave}
                        disabled={!canSave || isSaving}
                    >
                        {isSaving ? "Saving..." : "Save"}
                    </button>
                </div>
                {hasChanged && hint.text && (
                    <p className={styles.hint} style={{ color: hint.color }}>{hint.text}</p>
                )}
            </div>

            {isPremium && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Branding</h3>
                    <p className={styles.themeDesc}>Customize how your page header looks to visitors</p>

                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <div>
                            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                                <div
                                    onClick={() => setRemoveBranding(!removeBranding)}
                                    style={{
                                        width: 44, height: 24, borderRadius: 12, padding: 2,
                                        background: removeBranding ? "#4f46e5" : "#e2e8f0",
                                        cursor: "pointer", transition: "background 0.2s",
                                        display: "flex", alignItems: removeBranding ? "center" : "center",
                                        justifyContent: removeBranding ? "flex-end" : "flex-start",
                                    }}
                                >
                                    <div style={{
                                        width: 20, height: 20, borderRadius: 10, background: "#fff",
                                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transition: "transform 0.2s",
                                    }} />
                                </div>
                                <span style={{ fontSize: 14, color: "#101b31", fontWeight: 500 }}>
                                    Remove &quot;Linkter&quot; branding
                                </span>
                            </label>
                            <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 4, marginLeft: 54 }}>
                                Show your own logo/name instead of the Linkter brand
                            </p>
                        </div>

                        {removeBranding && (
                            <>
                                <div>
                                    <label style={{ display: "block", fontSize: 13, color: "#64718a", marginBottom: 6 }}>
                                        Custom Page Name
                                    </label>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <input
                                            type="text"
                                            value={customName}
                                            onChange={(e) => setCustomName(e.target.value)}
                                            placeholder="e.g. Bhavya's Links"
                                            className={styles.input}
                                            style={{ flex: 1 }}
                                        />
                                    </div>
                                    <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
                                        Shown next to your logo. Leave empty to hide the name.
                                    </p>
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: 13, color: "#64718a", marginBottom: 6 }}>
                                        Custom Logo
                                    </label>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        {customLogo ? (
                                            <div style={{ position: "relative" }}>
                                                <Image
                                                    src={customLogo}
                                                    alt="Custom logo"
                                                    width={48}
                                                    height={48}
                                                    unoptimized
                                                    style={{ borderRadius: 8, objectFit: "cover", border: "1px solid #e2e8f0" }}
                                                />
                                                <button
                                                    onClick={() => setCustomLogo("")}
                                                    style={{
                                                        position: "absolute", top: -6, right: -6,
                                                        width: 18, height: 18, borderRadius: 9,
                                                        background: "#ef4444", color: "#fff",
                                                        border: "2px solid #fff", fontSize: 10,
                                                        cursor: "pointer", display: "flex",
                                                        alignItems: "center", justifyContent: "center",
                                                        lineHeight: 1,
                                                    }}
                                                >
                                                    x
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => logoInputRef.current?.click()}
                                                disabled={isUploadingLogo}
                                                style={{
                                                    width: 48, height: 48, borderRadius: 8,
                                                    border: "2px dashed #e2e8f0", background: "#f8fafc",
                                                    cursor: "pointer", fontSize: 20, color: "#94a3b8",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                }}
                                            >
                                                {isUploadingLogo ? "..." : "+"}
                                            </button>
                                        )}
                                        <div>
                                            <button
                                                onClick={() => logoInputRef.current?.click()}
                                                disabled={isUploadingLogo}
                                                style={{
                                                    padding: "8px 16px", border: "1px solid #e2e8f0",
                                                    borderRadius: 8, background: "#fff", fontSize: 13,
                                                    fontWeight: 500, cursor: "pointer", color: "#101b31",
                                                }}
                                            >
                                                {isUploadingLogo ? "Uploading..." : customLogo ? "Change Logo" : "Upload Logo"}
                                            </button>
                                            <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
                                                Recommended: 64x64px, PNG or SVG
                                            </p>
                                        </div>
                                    </div>
                                    <input
                                        ref={logoInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        style={{ display: "none" }}
                                    />
                                </div>

                                <div style={{
                                    background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8,
                                    padding: 16, display: "flex", alignItems: "center", gap: 12,
                                }}>
                                    {customLogo ? (
                                        <Image src={customLogo} alt="Logo" width={32} height={32} unoptimized style={{ borderRadius: 6 }} />
                                    ) : (
                                        <div style={{
                                            width: 32, height: 32, borderRadius: 6, background: "#e2e8f0",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 14, color: "#94a3b8",
                                        }}>?</div>
                                    )}
                                    <span style={{ fontSize: 15, fontWeight: 600, color: "#101b31" }}>
                                        {customName || "Your Name"}
                                    </span>
                                </div>
                            </>
                        )}

                        <button
                            className={styles.saveBtn}
                            onClick={handleSaveBrand}
                            disabled={!brandChanged || isSavingBrand}
                        >
                            {isSavingBrand ? "Saving..." : "Save Branding"}
                        </button>
                    </div>
                </div>
            )}

            {!isPremium && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Branding</h3>
                    <p style={{ fontSize: 14, color: "#64718a", marginBottom: 12 }}>
                        Upgrade to Premium to remove Linkter branding, add your own logo and custom name.
                    </p>
                    <a
                        href="/pricing"
                        style={{
                            display: "inline-block", padding: "10px 20px", borderRadius: 8,
                            background: "linear-gradient(135deg, #4f46e5, #7c3aed)", color: "#fff",
                            fontSize: 14, fontWeight: 600, textDecoration: "none",
                        }}
                    >
                        Upgrade to Premium
                    </a>
                </div>
            )}

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Page Theme</h3>
                <p className={styles.themeDesc}>Customize your public profile page colors</p>

                <div className={styles.colorGroup}>
                    <label className={styles.colorLabel}>Background Color</label>
                    <div className={styles.colorPickerRow}>
                        <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className={styles.colorInput} />
                        <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className={styles.colorText} />
                    </div>
                    <div className={styles.presetRow}>
                        {PRESET_COLORS.map((c) => (
                            <button
                                key={c}
                                className={`${styles.preset} ${bgColor === c ? styles.presetActive : ""}`}
                                style={{ background: c }}
                                onClick={() => setBgColor(c)}
                            />
                        ))}
                    </div>
                </div>

                <div className={styles.colorGroup}>
                    <label className={styles.colorLabel}>Text Color</label>
                    <div className={styles.colorPickerRow}>
                        <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className={styles.colorInput} />
                        <input type="text" value={textColor} onChange={(e) => setTextColor(e.target.value)} className={styles.colorText} />
                    </div>
                    <div className={styles.presetRow}>
                        {PRESET_COLORS.map((c) => (
                            <button
                                key={c}
                                className={`${styles.preset} ${textColor === c ? styles.presetActive : ""}`}
                                style={{ background: c }}
                                onClick={() => setTextColor(c)}
                            />
                        ))}
                    </div>
                </div>

                <div className={styles.preview} style={{ background: bgColor, color: textColor, border: `1px solid ${textColor}20` }}>
                    <span className={styles.previewText}>Preview</span>
                </div>

                <button
                    className={styles.saveBtn}
                    onClick={handleSaveTheme}
                    disabled={!themeChanged || isSavingTheme}
                >
                    {isSavingTheme ? "Saving..." : "Save Theme"}
                </button>
            </div>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Account Info</h3>
                <div className={styles.infoRow}>
                    <span className={styles.label}>Username</span>
                    <span className={styles.value}>{user?.username}</span>
                </div>
                <div className={styles.infoRow}>
                    <span className={styles.label}>Email</span>
                    <span className={styles.value}>{user?.email}</span>
                </div>
            </div>
        </div>
    );
}

export default ProfileTab;
