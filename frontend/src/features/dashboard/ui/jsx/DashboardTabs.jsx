"use client";

import styles from "../css/DashboardTabs.module.css";
import { useAuth } from "@/features/auth/context/AuthContext";

function DashboardTabs({ activeTab, onTabChange }) {
    const { user } = useAuth();
    const BASE_TABS = ["Add Link", "View Links", "Deleted Links", "Analysis", "Profile"];
    const tabs = user?.role === "admin" ? [...BASE_TABS, "Admin"] : BASE_TABS;

    return (
        <div className={styles.tabs}>
            {tabs.map((tab) => (
                <button
                    key={tab}
                    className={`${styles.tab} ${activeTab === tab ? styles.active : ""}`}
                    onClick={() => onTabChange(tab)}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
}

export default DashboardTabs;
