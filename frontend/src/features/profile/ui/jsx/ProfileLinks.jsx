import ProfileLinkCard from "./ProfileLinkCard";
import styles from "../css/ProfilePage.module.css";

function ProfileLinks({ links, textColor, isPremium }) {
    const highlighted = links.filter((l) => l.isHighlighted && (!l.highlightExpiresAt || new Date(l.highlightExpiresAt) > new Date()));
    const regular = links.filter((l) => !l.isHighlighted || (l.highlightExpiresAt && new Date(l.highlightExpiresAt) <= new Date()));
    const sorted = [...highlighted, ...regular.sort((a, b) => (a.order || 0) - (b.order || 0))];

    return (
        <div className={styles.links}>
            {sorted.map((link) => (
                <ProfileLinkCard key={link._id} link={link} textColor={textColor} isPremium={isPremium} />
            ))}
        </div>
    );
}

export default ProfileLinks;
