export default function PrivacyPolicy() {
    return (
        <div style={{ maxWidth: 700, margin: "40px auto", padding: "0 20px", fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#101b31", marginBottom: 20 }}>Privacy Policy</h1>
            <p style={{ color: "#64718a", fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
                Last updated: {new Date().toLocaleDateString("en-IN")}
            </p>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "#101b31", marginBottom: 12 }}>1. Information We Collect</h2>
            <p style={{ color: "#64718a", fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
                When you create an account, we collect your name, email address, and password (encrypted). We also collect profile pictures, theme preferences, and link data you add to your profile.
            </p>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "#101b31", marginBottom: 12 }}>2. How We Use Your Information</h2>
            <p style={{ color: "#64718a", fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
                We use your information to provide and improve our services, personalize your experience, send payment-related emails, and communicate with you about your account.
            </p>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "#101b31", marginBottom: 12 }}>3. Data Sharing</h2>
            <p style={{ color: "#64718a", fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
                We do not sell or share your personal data with third parties except as required by law or to protect our rights.
            </p>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "#101b31", marginBottom: 12 }}>4. Data Security</h2>
            <p style={{ color: "#64718a", fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
                We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure.
            </p>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "#101b31", marginBottom: 12 }}>5. Cookies</h2>
            <p style={{ color: "#64718a", fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
                We use cookies to maintain your authentication session. These cookies are httpOnly, secure, and expire after 7 days.
            </p>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "#101b31", marginBottom: 12 }}>6. Your Rights</h2>
            <p style={{ color: "#64718a", fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
                You can access, update, or delete your account at any time. Contact us for any data-related requests.
            </p>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "#101b31", marginBottom: 12 }}>7. Contact</h2>
            <p style={{ color: "#64718a", fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
                For privacy-related inquiries, contact us at support@linkters.dev
            </p>
        </div>
    );
}
