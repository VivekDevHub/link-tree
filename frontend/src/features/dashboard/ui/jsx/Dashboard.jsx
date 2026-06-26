"use client";

import { useState, useEffect } from "react";
import Navbar from "@/features/shared/Navbar";
import Footer from "@/features/shared/Footer";
import DashboardTabs from "./DashboardTabs";
import DashboardForm from "./DashboardForm";
import ViewLinks from "./ViewLinks";
import DeletedLinks from "./DeletedLinks";
import Analysis from "./Analysis";
import ProfileTab from "./ProfileTab";
import { getPendingPayments, approvePayment, rejectPayment } from "@/features/payments/api/payment.api";
import { toast } from "react-toastify";
import Image from "next/image";
import styles from "../css/Dashboard.module.css";

function AdminPanel() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rejectModal, setRejectModal] = useState(null);
    const [rejectReason, setRejectReason] = useState("");

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const data = await getPendingPayments();
            setPayments(data);
        } catch {
            toast.error("Failed to fetch payments");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await approvePayment(id);
            toast.success("Payment approved");
            setPayments((prev) => prev.filter((p) => p._id !== id));
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed");
        }
    };

    const handleReject = async () => {
        if (!rejectModal) return;
        try {
            await rejectPayment(rejectModal, rejectReason);
            toast.success("Payment rejected");
            setPayments((prev) => prev.filter((p) => p._id !== rejectModal));
            setRejectModal(null);
            setRejectReason("");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed");
        }
    };

    if (loading) return <p style={{ padding: 20, color: "#64718a" }}>Loading...</p>;

    return (
        <div style={{ padding: "0 20px 40px" }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#101b31", marginBottom: 8 }}>Admin Panel</h2>
            <p style={{ color: "#64718a", marginBottom: 24 }}>Review pending premium payments</p>
            {payments.length === 0 ? (
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: 40, textAlign: "center" }}>
                    <p style={{ color: "#94a3b8", fontSize: 16 }}>No pending payments</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {payments.map((p) => (
                        <div key={p._id} style={{
                            background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12,
                            padding: 24, display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start",
                        }}>
                            <div style={{ flex: "1 1 200px" }}>
                                <p style={{ color: "#101b31", fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                                    {p.userId?.name || "Unknown"}
                                </p>
                                <p style={{ color: "#64718a", fontSize: 14, marginBottom: 4 }}>{p.userId?.email}</p>
                                <p style={{ color: "#4f46e5", fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
                                    {p.plan === "monthly" ? "Monthly" : "Yearly"} — ₹{p.amount}
                                </p>
                                <p style={{ color: "#94a3b8", fontSize: 12 }}>
                                    {new Date(p.createdAt).toLocaleString("en-IN")}
                                </p>
                            </div>
                            <div style={{ flex: "0 0 auto" }}>
                                {p.screenshot && (
                                    <Image src={p.screenshot} alt="Screenshot" width={120} height={120}
                                        style={{ borderRadius: 8, objectFit: "cover", border: "1px solid #e2e8f0" }} />
                                )}
                            </div>
                            <div style={{ display: "flex", gap: 8, flex: "1 1 100%", justifyContent: "flex-end" }}>
                                <button onClick={() => handleApprove(p._id)} style={{
                                    padding: "8px 20px", border: "none", borderRadius: 8,
                                    background: "#22c55e", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer",
                                }}>Approve</button>
                                <button onClick={() => setRejectModal(p._id)} style={{
                                    padding: "8px 20px", border: "1px solid #e2e8f0", borderRadius: 8,
                                    background: "#fff", color: "#dc2626", fontSize: 14, fontWeight: 600, cursor: "pointer",
                                }}>Reject</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {rejectModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
                    <div style={{ background: "#fff", borderRadius: 12, padding: 32, width: "90%", maxWidth: 400 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 600, color: "#101b31", marginBottom: 12 }}>Reject Payment</h3>
                        <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Reason (optional)" rows={3}
                            style={{ width: "100%", padding: 12, border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, resize: "vertical", fontFamily: "inherit", marginBottom: 16 }} />
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                            <button onClick={() => { setRejectModal(null); setRejectReason(""); }}
                                style={{ padding: "8px 16px", border: "1px solid #e2e8f0", borderRadius: 8, background: "#fff", fontSize: 14, cursor: "pointer" }}>Cancel</button>
                            <button onClick={handleReject}
                                style={{ padding: "8px 16px", border: "none", borderRadius: 8, background: "#dc2626", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Reject</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Dashboard() {
    const [activeTab, setActiveTab] = useState("Add Link");

    return (
        <div className={styles.wrapper}>
            <Navbar />
            <div className={styles.content}>
                <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
                {activeTab === "Add Link" && <DashboardForm />}
                {activeTab === "View Links" && <ViewLinks />}
                {activeTab === "Deleted Links" && <DeletedLinks />}
                {activeTab === "Analysis" && <Analysis />}
                {activeTab === "Profile" && <ProfileTab />}
                {activeTab === "Admin" && <AdminPanel />}
            </div>
            <Footer />
        </div>
    );
}

export default Dashboard;
