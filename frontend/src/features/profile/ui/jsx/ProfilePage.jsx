"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import useProfileLinks from "../../hooks/useProfileLinks";
import usePublicProfile from "../../hooks/usePublicProfile";
import ProfileHeader from "./ProfileHeader";
import ProfileUsername from "./ProfileUsername";
import ProfileLinks from "./ProfileLinks";
import ProfilePicture from "@/features/auth/ui/jsx/ProfilePicture";
import { useAuth } from "@/features/auth/context/AuthContext";
import { recordProfileVisit } from "@/features/dashboard/api/link.api";
import styles from "../css/ProfilePage.module.css";

function ProfilePage() {
    const { username } = useParams();
    const { user } = useAuth();
    const recordedVisitRef = useRef(null);
    const { links, isLoading: linksLoading, error } = useProfileLinks(username);
    const { profile, isLoading: themeLoading } = usePublicProfile(username);
    const isOwner = user?.username === username;

    useEffect(() => {
        if (username && recordedVisitRef.current !== username) {
            recordedVisitRef.current = username;
            recordProfileVisit(username).catch(() => {
                recordedVisitRef.current = null;
            });
        }
    }, [username]);

    const bgColor = profile?.bgColor || "#ffffff";
    const textColor = profile?.textColor || "#333333";

    if (linksLoading || themeLoading) {
        return (
            <div className={styles.container} style={{ background: bgColor, color: textColor }}>
                <div className={styles.inner}>
                    <p className={styles.loading}>Loading...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container} style={{ background: bgColor, color: textColor }}>
                <div className={styles.inner}>
                    <ProfileHeader
                        bgColor={bgColor}
                        textColor={textColor}
                        customLogo={profile?.customLogo}
                        customName={profile?.customName}
                        removeLinkterBranding={profile?.removeLinkterBranding}
                    />
                    <div className={styles.profileRow}>
                        <ProfilePicture isOwner={isOwner} profileUser={profile} />
                        <ProfileUsername username={username} textColor={textColor} />
                    </div>
                    <p className={styles.error}>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container} style={{ background: bgColor, color: textColor }}>
            <div className={styles.inner}>
                <ProfileHeader
                    bgColor={bgColor}
                    textColor={textColor}
                    customLogo={profile?.customLogo}
                    customName={profile?.customName}
                    removeLinkterBranding={profile?.removeLinkterBranding}
                />
                <div className={styles.profileRow}>
                    <ProfilePicture isOwner={isOwner} profileUser={profile} />
                    <ProfileUsername username={username} textColor={textColor} />
                </div>
                <ProfileLinks links={links} textColor={textColor} isPremium={profile?.isPremium} />
            </div>
        </div>
    );
}

export default ProfilePage;

