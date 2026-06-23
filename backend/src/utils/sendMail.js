import transporter from "../config/mail.config.js";
import { SMTP_FROM } from "../config/env.config.js";

async function sendMail({ to, subject, html }) {
    return transporter.sendMail({
        from: SMTP_FROM,
        to,
        subject,
        html,
    });
}

export default sendMail;