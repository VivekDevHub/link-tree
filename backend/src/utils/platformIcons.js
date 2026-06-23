const PLATFORM_ICONS = {
    youtube: { color: "#FF0000", label: "YouTube" },
    instagram: { color: "#E4405F", label: "Instagram" },
    twitter: { color: "#000000", label: "X" },
    x: { color: "#000000", label: "X" },
    facebook: { color: "#1877F2", label: "Facebook" },
    telegram: { color: "#26A5E4", label: "Telegram" },
    reddit: { color: "#FF4500", label: "Reddit" },
    github: { color: "#333333", label: "GitHub" },
    linkedin: { color: "#0A66C2", label: "LinkedIn" },
    discord: { color: "#5865F2", label: "Discord" },
    tiktok: { color: "#000000", label: "TikTok" },
    snapchat: { color: "#FFFC00", label: "Snapchat" },
    pinterest: { color: "#BD081C", label: "Pinterest" },
    whatsapp: { color: "#25D366", label: "WhatsApp" },
    spotify: { color: "#1DB954", label: "Spotify" },
    twitch: { color: "#9146FF", label: "Twitch" },
   Threads: { color: "#000000", label: "Threads" },
    threads: { color: "#000000", label: "Threads" },
    github: { color: "#333333", label: "GitHub" },
    dribbble: { color: "#EA4C89", label: "Dribbble" },
    behance: { color: "#1769FF", label: "Behance" },
    medium: { color: "#000000", label: "Medium" },
    substack: { color: "#FF6719", label: "Substack" },
    patreon: { color: "#FF424D", label: "Patreon" },
    buyMeACoffee: { color: "#FFDD00", label: "Buy Me a Coffee" },
    linktree: { color: "#43E660", label: "Linktree" },
};

function getPlatformFromUrl(url) {
    const hostname = new URL(url).hostname.toLowerCase().replace("www.", "");
    const platformMap = {
        "youtube.com": "youtube",
        "youtu.be": "youtube",
        "instagram.com": "instagram",
        "twitter.com": "twitter",
        "x.com": "x",
        "facebook.com": "facebook",
        "fb.com": "facebook",
        "telegram.org": "telegram",
        "t.me": "telegram",
        "reddit.com": "reddit",
        "github.com": "github",
        "linkedin.com": "linkedin",
        "discord.com": "discord",
        "tiktok.com": "tiktok",
        "snapchat.com": "snapchat",
        "pinterest.com": "pinterest",
        "wa.me": "whatsapp",
        "whatsapp.com": "whatsapp",
        "spotify.com": "spotify",
        "twitch.tv": "twitch",
        "threads.net": "threads",
        "dribbble.com": "dribbble",
        "behance.net": "behance",
        "medium.com": "medium",
        "substack.com": "substack",
        "patreon.com": "patreon",
        "buymeacoffee.com": "buyMeACoffee",
        "linktr.ee": "linktree",
    };
    for (const [domain, platform] of Object.entries(platformMap)) {
        if (hostname.includes(domain)) return platform;
    }
    return null;
}

export { PLATFORM_ICONS, getPlatformFromUrl };