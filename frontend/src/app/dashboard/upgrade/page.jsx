"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "../../../features/auth/context/AuthContext";
import { submitPayment, getMyPayments } from "../../../features/payments/api/payment.api";
import { toast } from "react-toastify";
import Image from "next/image";

const UPI_ID = "bhavyadhanwani1234@okicici";
const AMOUNTS = { monthly: 20, yearly: 200 };

function UpgradeContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user } = useAuth();
    const plan = searchParams.get("plan") || "monthly";
    const amount = AMOUNTS[plan] || 20;
    const [screenshot, setScreenshot] = useState("");
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        if (!user) router.push("/auth");
        getMyPayments().then(setPayments).catch(() => {});
    }, [user, router]);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "linkter_uploads");
            const res = await fetch("https://api.cloudinary.com/v1_1/dummy/image/upload", { method: "POST", body: formData });
            const data = await res.json();
            setScreenshot(data.secure_url);
        } catch {
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async () => {
        if (!screenshot) {
            toast.error("Please upload payment screenshot");
            return;
        }
        setSubmitting(true);
        try {
            await submitPayment(plan, screenshot);
            toast.success("Payment submitted! Under review.");
            getMyPayments().then(setPayments).catch(() => {});
        } catch (err) {
            toast.error(err?.response?.data?.message || "Submission failed");
        } finally {
            setSubmitting(false);
        }
    };

    const pendingPayment = payments.find((p) => p.status === "pending");
    const approvedPayment = payments.find((p) => p.status === "approved");

    return (
        <div style={{ maxWidth: 600, margin: "40px auto", padding: "0 20px", fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#101b31", marginBottom: 8 }}>
                {plan === "monthly" ? "Monthly" : "Yearly"} Premium
            </h1>
            <p style={{ color: "#64718a", fontSize: 16, marginBottom: 32 }}>
                Pay ₹{amount} via UPI and upload the screenshot
            </p>

            {approvedPayment ? (
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: 24, textAlign: "center" }}>
                    <h2 style={{ color: "#16a34a", fontSize: 20, marginBottom: 8 }}>You&apos;re Premium!</h2>
                    <p style={{ color: "#64718a" }}>Your subscription is active.</p>
                </div>
            ) : pendingPayment ? (
                <div style={{ background: "#fefce8", border: "1px solid #fde68a", borderRadius: 12, padding: 24, textAlign: "center" }}>
                    <h2 style={{ color: "#ca8a04", fontSize: 20, marginBottom: 8 }}>Under Review</h2>
                    <p style={{ color: "#64718a" }}>Your payment is being reviewed. We&apos;ll notify you soon.</p>
                </div>
            ) : (
                <>
                    <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24, marginBottom: 24, textAlign: "center" }}>
                        <p style={{ color: "#64718a", fontSize: 14, marginBottom: 12 }}>Scan this QR or pay to UPI ID:</p>
                        <p style={{ color: "#4f46e5", fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{UPI_ID}</p>
                        <div style={{ background: "#fff", display: "inline-block", padding: 16, borderRadius: 8, border: "1px solid #e2e8f0" }}>
                            <Image
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=${UPI_ID}&pn=Linkter&am=${amount}&cu=INR`)}`}
                                alt="UPI QR"
                                width={200}
                                height={200}
                            />
                        </div>
                        <p style={{ color: "#101b31", fontSize: 20, fontWeight: 700, marginTop: 16 }}>Amount: ₹{amount}</p>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: "block", color: "#101b31", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                            Upload Payment Screenshot
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleUpload}
                            disabled={uploading}
                            style={{
                                width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0",
                                borderRadius: 8, fontSize: 14, background: "#fff",
                            }}
                        />
                        {uploading && <p style={{ color: "#64718a", fontSize: 13, marginTop: 8 }}>Uploading...</p>}
                        {screenshot && (
                            <div style={{ marginTop: 12 }}>
                                <Image src={screenshot} alt="Screenshot" width={100} height={100} style={{ borderRadius: 8, objectFit: "cover" }} />
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={!screenshot || uploading || submitting}
                        style={{
                            width: "100%", padding: "14px 0", border: "none", borderRadius: 8,
                            background: screenshot && !submitting ? "#4f46e5" : "#e2e8f0",
                            color: screenshot && !submitting ? "#fff" : "#94a3b8",
                            fontSize: 16, fontWeight: 600, cursor: screenshot && !submitting ? "pointer" : "not-allowed",
                        }}
                    >
                        {submitting ? "Submitting..." : "Submit for Review"}
                    </button>
                </>
            )}

            {payments.length > 0 && (
                <div style={{ marginTop: 32 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 600, color: "#101b31", marginBottom: 12 }}>Payment History</h3>
                    {payments.map((p) => (
                        <div key={p._id} style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 8, marginBottom: 8,
                        }}>
                            <div>
                                <p style={{ color: "#101b31", fontSize: 14, fontWeight: 500 }}>{p.plan === "monthly" ? "Monthly" : "Yearly"} — ₹{p.amount}</p>
                                <p style={{ color: "#94a3b8", fontSize: 12 }}>{new Date(p.createdAt).toLocaleDateString("en-IN")}</p>
                            </div>
                            <span style={{
                                padding: "4px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600,
                                background: p.status === "approved" ? "#dcfce7" : p.status === "rejected" ? "#fee2e2" : "#fef9c3",
                                color: p.status === "approved" ? "#16a34a" : p.status === "rejected" ? "#dc2626" : "#ca8a04",
                            }}>
                                {p.status}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function UpgradePage() {
    return (
        <Suspense fallback={<div style={{ textAlign: "center", marginTop: 40 }}>Loading...</div>}>
            <UpgradeContent />
        </Suspense>
    );
}
