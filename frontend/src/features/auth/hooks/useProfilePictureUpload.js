"use client";

import { useState } from "react";
import { getImagekitAuth, updateProfilePicture } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";

function useProfilePictureUpload() {
    const { user, loginUser } = useAuth();
    const [isUploading, setIsUploading] = useState(false);

    async function upload(file) {
        if (!file) return;

        setIsUploading(true);

        try {
            const authRes = await getImagekitAuth();
            const { token, expire, signature } = authRes.data;

            const formData = new FormData();
            formData.append("file", file);
            formData.append("publicKey", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY);
            formData.append("fileName", `pfp-${user.username}-${Date.now()}`);
            formData.append("token", token);
            formData.append("expire", expire);
            formData.append("signature", signature);
            formData.append("folder", "/profile-pictures");

            const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
                method: "POST",
                body: formData,
            });

            const uploadData = await uploadRes.json();

            if (!uploadRes.ok) {
                throw new Error(uploadData.message || "Upload failed");
            }

            const imageUrl = uploadData.url;

            const updateRes = await updateProfilePicture(imageUrl);
            loginUser(updateRes.data);

            return imageUrl;
        } catch (error) {
            throw error;
        } finally {
            setIsUploading(false);
        }
    }

    return { upload, isUploading };
}

export default useProfilePictureUpload;
