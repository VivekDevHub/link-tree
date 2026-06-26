"use client";

import { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    ArcElement,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";
import { toast } from "react-toastify";
import { useAuth } from "@/features/auth/context/AuthContext";
import { getClicksPerLink, getClickTimeline, getProfileVisitAnalytics, getProfileVisitTimeline } from "../../api/link.api";
import styles from "../css/Analysis.module.css";

ChartJS.register(ArcElement, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

const TIME_OPTIONS = [
    { label: "All Time", value: "" },
    { label: "Last 30 Days", value: "last30d" },
    { label: "Last Week", value: "last7d" },
    { label: "Last 24 Hours", value: "last24h" },
    { label: "Last Hour", value: "last1h" },
];

const COLORS = [
    "#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#ef4444",
    "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#6366f1",
];

function formatTimeLabel(raw, timeFilter) {
    const date = new Date(raw);
    if (timeFilter === "last1h") {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    if (timeFilter === "last24h") {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function getApiErrorMessage(error) {
    return error?.response?.data?.message || error.message || "Something went wrong";
}

function Analysis() {
    const { user } = useAuth();
    const [pieData, setPieData] = useState([]);
    const [timelineData, setTimelineData] = useState({ times: [], links: [] });
    const [visitData, setVisitData] = useState({ total: 0, last24h: 0, last7d: 0, last30d: 0 });
    const [visitTimeline, setVisitTimeline] = useState({ times: [], data: [] });
    const [selected, setSelected] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [perLinkRes, timelineRes, visitAnalyticsRes, visitTimelineRes] = await Promise.all([
                    getClicksPerLink(user.username, selected),
                    getClickTimeline(user.username, selected),
                    getProfileVisitAnalytics(user.username),
                    getProfileVisitTimeline(user.username, selected),
                ]);
                setPieData(perLinkRes.data);
                setTimelineData(timelineRes.data);
                setVisitData(visitAnalyticsRes.data);
                setVisitTimeline(visitTimelineRes.data);
            } catch (error) {
                toast.error(getApiErrorMessage(error));
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [user.username, selected]);

    if (isLoading) {
        return <p className={styles.loading}>Loading analytics...</p>;
    }

    const hasPieData = pieData.length > 0;
    const hasTimelineData = timelineData.links.length > 0;

    const pieChartData = {
        labels: hasPieData ? pieData.map((d) => d.title) : ["No Clicks"],
        datasets: [
            {
                data: hasPieData ? pieData.map((d) => d.count) : [1],
                backgroundColor: hasPieData
                    ? pieData.map((_, i) => COLORS[i % COLORS.length])
                    : ["#d0d0d0"],
                borderWidth: 0,
            },
        ],
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: hasPieData,
                position: "bottom",
            },
            tooltip: {
                enabled: hasPieData,
            },
        },
    };

    const labels = timelineData.times.map((t) => formatTimeLabel(t, selected));

    const lineChartData = {
        labels,
        datasets: timelineData.links.map((link, i) => ({
            label: link.title,
            data: link.data,
            borderColor: COLORS[i % COLORS.length],
            backgroundColor: COLORS[i % COLORS.length] + "20",
            fill: true,
            tension: 0.3,
            pointRadius: 3,
            pointHoverRadius: 5,
        })),
    };

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: "index",
            intersect: false,
        },
        plugins: {
            legend: {
                position: "bottom",
                labels: { boxWidth: 12, padding: 15 },
            },
        },
        scales: {
            x: {
                ticks: { maxRotation: 45, font: { size: 11 } },
                grid: { display: false },
            },
            y: {
                beginAtZero: true,
                ticks: { stepSize: 1, font: { size: 11 } },
            },
        },
    };

    const totalClicks = pieData.reduce((sum, d) => sum + d.count, 0);
    const hasVisitTimeline = visitTimeline.times.length > 0;

    const visitLineData = {
        labels: visitTimeline.times.map((t) => formatTimeLabel(t, selected)),
        datasets: [
            {
                label: "Profile Views",
                data: visitTimeline.data,
                borderColor: "#8b5cf6",
                backgroundColor: "#8b5cf620",
                fill: true,
                tension: 0.3,
                pointRadius: 3,
                pointHoverRadius: 5,
            },
        ],
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Click Analytics</h2>
                <select
                    className={styles.select}
                    value={selected}
                    onChange={(e) => {
                        setSelected(e.target.value);
                        setIsLoading(true);
                    }}
                >
                    {TIME_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.pieSection}>
                <h3 className={styles.sectionTitle}>Breakdown by Link</h3>
                <div className={styles.chart}>
                    <Pie data={pieChartData} options={pieChartOptions} />
                </div>
            </div>

            {hasTimelineData && (
                <div className={styles.lineChartWrap}>
                    <h3 className={styles.sectionTitle}>Clicks Over Time</h3>
                    <div className={styles.lineChart}>
                        <Line data={lineChartData} options={lineChartOptions} />
                    </div>
                </div>
            )}

            {hasVisitTimeline && (
                <div className={styles.lineChartWrap}>
                    <h3 className={styles.sectionTitle}>Profile Views Over Time</h3>
                    <div className={styles.lineChart}>
                        <Line data={visitLineData} options={lineChartOptions} />
                    </div>
                </div>
            )}

            {hasPieData && (
                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <span className={styles.statLabel}>Total Clicks</span>
                        <span className={styles.statValue}>{totalClicks}</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statLabel}>Links</span>
                        <span className={styles.statValue}>{pieData.length}</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statLabel}>Total Views</span>
                        <span className={styles.statValue}>{visitData.total}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Analysis;
