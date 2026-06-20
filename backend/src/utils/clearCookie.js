// Clearing auth cookie
function clearAuthCookie(res) {
    res.cookie("linkters", "", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 0,
    });
}

export default clearAuthCookie;