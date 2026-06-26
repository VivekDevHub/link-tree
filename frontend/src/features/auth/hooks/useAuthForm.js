"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { loginUser, signupUser } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";
import {
    AUTH_MODES,
    LOGIN_FORM_INITIAL_STATE,
    SIGNUP_FORM_INITIAL_STATE
} from "../state/auth.state";

function getApiErrorMessage(error) {
    return error?.response?.data?.message || error.message || "Something went wrong";
}

function useAuthForm() {
    const [authMode, setAuthMode] = useState(AUTH_MODES.LOGIN);
    const [loginForm, setLoginForm] = useState(LOGIN_FORM_INITIAL_STATE);
    const [signupForm, setSignupForm] = useState(SIGNUP_FORM_INITIAL_STATE);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { loginUser: setAuthUser } = useAuth();

    const isLogin = authMode === AUTH_MODES.LOGIN;
    const formValues = isLogin ? loginForm : signupForm;

    function handleInputChange(event) {
        const { name, value } = event.target;

        if (isLogin) {
            setLoginForm((prev) => ({ ...prev, [name]: value }));
            return;
        }

        setSignupForm((prev) => ({ ...prev, [name]: value }));
    }

    function handleCheckboxChange(event) {
        const { name, checked } = event.target;
        setSignupForm((prev) => ({ ...prev, [name]: checked }));
    }

    function switchAuthMode() {
        setAuthMode((prev) => (
            prev === AUTH_MODES.LOGIN ? AUTH_MODES.SIGNUP : AUTH_MODES.LOGIN
        ));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const response = isLogin
                ? await loginUser({
                    email: loginForm.email,
                    password: loginForm.password,
                })
                : await signupUser(signupForm);

            setAuthUser(response.data);
            toast.success(response.message);
            router.push("/dashboard");
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    }

    return {
        authMode,
        formValues,
        isLogin,
        isSubmitting,
        handleInputChange,
        handleCheckboxChange,
        handleSubmit,
        switchAuthMode,
    };
}

export default useAuthForm;
