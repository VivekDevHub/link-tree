"use client";

import { useAuth } from "@/features/auth/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Home = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      router.push(user ? "/dashboard" : "/auth");
    }
  }, [user, isLoading, router]);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}>
      Loading...
    </div>
  );
};

export default Home;
