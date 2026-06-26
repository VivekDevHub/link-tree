"use client";

import ProtectedRoute from "@/features/auth/ui/jsx/ProtectedRoute";
import useLogout from "@/features/auth/hooks/useLogout";
import { useAuth } from "@/features/auth/context/AuthContext";
import Dashboard from "@/features/dashboard/ui/jsx/Dashboard";

function DashboardPage() {
    const { user } = useAuth();
    const { handleLogout, isLoggingOut } = useLogout();

    return (
        <ProtectedRoute>
            {/* <div style={{ padding: "2rem" }}>
                <h1>Dashboard</h1>
                <p>Welcome, {user?.username || user?.email}!</p>
                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    style={{
                        marginTop: "1rem",
                        padding: "0.5rem 1rem",
                        cursor: isLoggingOut ? "not-allowed" : "pointer",
                    }}
                >
                    {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
            </div> */}

            <Dashboard />

        </ProtectedRoute>
    );
}

export default DashboardPage;
