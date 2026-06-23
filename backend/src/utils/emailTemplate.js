import { FRONTEND_URL } from "../config/env.config.js";

function passwordResetEmailTemplate(username, resetUrl) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - Linkter</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f5f7;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7;padding:40px 20px;">
        <tr>
            <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:500px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
                    <tr>
                        <td style="background-color:#4f46e5;padding:30px;text-align:center;">
                            <h1 style="color:#ffffff;font-size:24px;margin:0;font-weight:700;">Linkter</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:40px 30px;">
                            <h2 style="color:#101b31;font-size:20px;margin:0 0 10px;">Hi ${username},</h2>
                            <p style="color:#64718a;font-size:15px;line-height:1.6;margin:0 0 25px;">
                                We received a request to reset your password. Click the button below to set a new password. This link will expire in <strong>10 minutes</strong>.
                            </p>
                            <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:25px;">
                                <tr>
                                    <td align="center">
                                        <a href="${resetUrl}" style="display:inline-block;background-color:#4f46e5;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:8px;">
                                            Reset Password
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <p style="color:#64718a;font-size:14px;line-height:1.6;margin:0 0 10px;">
                                If the button doesn't work, copy and paste this link into your browser:
                            </p>
                            <p style="color:#4f46e5;font-size:13px;word-break:break-all;margin:0 0 25px;">
                                <a href="${resetUrl}" style="color:#4f46e5;">${resetUrl}</a>
                            </p>
                            <p style="color:#94a3b8;font-size:13px;line-height:1.5;margin:0;">
                                If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color:#f8fafc;padding:20px 30px;text-align:center;border-top:1px solid #e2e8f0;">
                            <p style="color:#94a3b8;font-size:12px;margin:0;">
                                &copy; ${new Date().getFullYear()} Linkter. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

function buildResetUrl(token) {
    return `${FRONTEND_URL}/reset-password/${token}`;
}

export { passwordResetEmailTemplate, buildResetUrl };