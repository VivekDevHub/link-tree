// Setting auth cookie
function setAuthCookie(res, token) {
    res.cookie("linkters", token, {

        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days

    });
}

export default setAuthCookie;