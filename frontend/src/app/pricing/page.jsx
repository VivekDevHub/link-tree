"use client";

import { useState } from "react";
import { useAuth } from "../../features/auth/context/AuthContext";
import { useRouter } from "next/navigation";

export default function PricingPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [selectedPlan, setSelectedPlan] = useState(null);

    const plans = [
        {
            id: "monthly",
            name: "Monthly",
            price: "₹20",
            period: "/month",
            features: [
                "Custom brand logo on your page",
                "Custom page title (your name)",
                "Remove Linkter branding",
                "Highlight links to feature them",
                "Custom link border colors",
                "Favicon auto-fetch",
            ],
        },
        {
            id: "yearly",
            name: "Yearly",
            price: "₹200",
            period: "/year",
            badge: "Save ₹40",
            features: [
                "Everything in Monthly",
                "Best value — save ₹40/year",
                "Priority support",
            ],
        },
    ];

    const handleSelect = (planId) => {
        if (!user) {
            router.push("/auth");
            return;
        }
        setSelectedPlan(planId);
        router.push(`/dashboard/upgrade?plan=${planId}`);
    };

    return (
        <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 20px", fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: "#101b31", textAlign: "center", marginBottom: 8 }}>
                Upgrade to Premium
            </h1>
            <p style={{ color: "#64718a", fontSize: 16, textAlign: "center", marginBottom: 40 }}>
                Customize your page with your own branding and advanced features
            </p>

            <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        style={{
                            flex: "1 1 300px",
                            maxWidth: 380,
                            border: selectedPlan === plan.id ? "2px solid #4f46e5" : "1px solid #e2e8f0",
                            borderRadius: 16,
                            padding: 32,
                            background: "#fff",
                            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                            position: "relative",
                        }}
                    >
                        {plan.badge && (
                            <span style={{
                                position: "absolute", top: -12, right: 20,
                                background: "#4f46e5", color: "#fff", fontSize: 12,
                                fontWeight: 600, padding: "4px 12px", borderRadius: 20,
                            }}>
                                {plan.badge}
                            </span>
                        )}
                        <h2 style={{ fontSize: 22, fontWeight: 600, color: "#101b31", marginBottom: 4 }}>{plan.name}</h2>
                        <div style={{ marginBottom: 20 }}>
                            <span style={{ fontSize: 36, fontWeight: 700, color: "#101b31" }}>{plan.price}</span>
                            <span style={{ fontSize: 15, color: "#94a3b8" }}>{plan.period}</span>
                        </div>
                        <ul style={{ listStyle: "none", padding: 0, marginBottom: 24 }}>
                            {plan.features.map((f, i) => (
                                <li key={i} style={{ color: "#64718a", fontSize: 14, padding: "6px 0", display: "flex", alignItems: "center", gap: 8 }}>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3 3 7-7" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => handleSelect(plan.id)}
                            style={{
                                width: "100%", padding: "12px 0", border: "none", borderRadius: 8,
                                background: selectedPlan === plan.id ? "#4f46e5" : "#f1f5f9",
                                color: selectedPlan === plan.id ? "#fff" : "#101b31",
                                fontSize: 15, fontWeight: 600, cursor: "pointer",
                            }}
                        >
                            {user ? "Select Plan" : "Login to Upgrade"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
