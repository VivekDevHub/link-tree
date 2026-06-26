const AUTH_MODES = {
    LOGIN: "login",
    SIGNUP: "signup",
};

const LOGIN_FORM_INITIAL_STATE = {
    email: "",
    password: "",
};

const SIGNUP_FORM_INITIAL_STATE = {
    name: "",
    email: "",
    password: "",
    privacyPolicyAccepted: false,
    termsAccepted: false,
};

export {
    AUTH_MODES,
    LOGIN_FORM_INITIAL_STATE,
    SIGNUP_FORM_INITIAL_STATE
};
