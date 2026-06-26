"use client";

import { useState } from "react";

function usePasswordVisibility() {
    const [showPassword, setShowPassword] = useState(false);

    function togglePasswordVisibility() {
        setShowPassword((currentValue) => !currentValue);
    }

    return {
        showPassword,
        togglePasswordVisibility,
    };
}

export default usePasswordVisibility;
