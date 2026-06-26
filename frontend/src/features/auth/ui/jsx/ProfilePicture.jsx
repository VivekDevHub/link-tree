"use client";

import { useRef } from "react";
import Image from "next/image";
import useProfilePictureUpload from "../../hooks/useProfilePictureUpload";
import { useAuth } from "../../context/AuthContext";
import styles from "../css/ProfilePicture.module.css";

function ProfilePicture({ isOwner, profileUser }) {
    const { user } = useAuth();
    const { upload, isUploading } = useProfilePictureUpload();
    const fileInputRef = useRef(null);

    const displayUser = isOwner ? user : profileUser;

    function handleClick() {
        if (isOwner) {
            fileInputRef.current?.click();
        }
    }

    async function handleChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) return;
        if (file.size > 5 * 1024 * 1024) return;

        try {
            await upload(file);
        } catch {
            // error handled by hook
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    return (
        <div className={styles.wrapper}>
            <button
                className={styles.avatarBtn}
                onClick={handleClick}
                disabled={isUploading}
                title={displayUser?.username}
                style={{ cursor: isOwner ? "pointer" : "default" }}
            >
                {displayUser?.profilePicture ? (
                    <Image
                        src={displayUser.profilePicture}
                        alt={displayUser.username}
                        width={80}
                        height={80}
                        unoptimized
                        className={styles.avatar}
                    />
                ) : (
                    <span className={styles.initial}>
                        {displayUser?.username?.[0]?.toUpperCase() || "?"}
                    </span>
                )}
            </button>
            {isOwner && (
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className={styles.fileInput}
                />
            )}
        </div>
    );
}

export default ProfilePicture;
