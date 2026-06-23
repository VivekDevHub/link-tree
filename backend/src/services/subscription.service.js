import {
    createPaymentRequest,
    getPaymentRequestsByUser,
    getPendingPaymentRequests,
    approvePaymentRequest,
    rejectPaymentRequest,
    getActiveSubscription,
    checkAndExpireSubscriptions,
} from "../dao/subscription.dao.js";
import { findUserById } from "../dao/user.dao.js";
import sendMail from "../utils/sendMail.js";
import ApiError from "../utils/ApiError.js";

const PLANS = {
    monthly: { name: "Monthly", price: 20, duration: "1 month" },
    yearly: { name: "Yearly", price: 200, duration: "1 year" },
};

async function getPlansService() {
    return PLANS;
}

async function submitPaymentService(userId, plan, screenshotUrl) {
    if (!PLANS[plan]) {
        throw new ApiError(400, "Invalid plan. Choose monthly or yearly.");
    }

    const user = await findUserById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const existing = await getActiveSubscription(userId);
    if (existing) {
        throw new ApiError(400, "You already have an active subscription");
    }

    const pending = await createPaymentRequest(userId, plan, PLANS[plan].price, screenshotUrl);

    await sendMail({
        to: user.email,
        subject: "Payment Under Review - Linkter Premium",
        html: paymentUnderReviewTemplate(user.name, PLANS[plan].name),
    });

    return pending;
}

async function getMyPaymentsService(userId) {
    return getPaymentRequestsByUser(userId);
}

async function getPendingPaymentsService() {
    return getPendingPaymentRequests();
}

async function approvePaymentService(paymentId, adminId) {
    const result = await approvePaymentRequest(paymentId, adminId);
    if (!result) {
        throw new ApiError(404, "Payment request not found");
    }

    const user = await findUserById(result.payment.userId);
    if (user) {
        await sendMail({
            to: user.email,
            subject: "Payment Approved - Linkter Premium",
            html: paymentApprovedTemplate(user.name, result.payment.plan),
        });
    }

    return result;
}

async function rejectPaymentService(paymentId, adminId, reason) {
    const result = await rejectPaymentRequest(paymentId, adminId, reason);
    if (!result) {
        throw new ApiError(404, "Payment request not found");
    }

    const user = await findUserById(result.userId);
    if (user) {
        await sendMail({
            to: user.email,
            subject: "Payment Rejected - Linkter",
            html: paymentRejectedTemplate(user.name, reason),
        });
    }

    return result;
}

async function getMySubscriptionService(userId) {
    return getActiveSubscription(userId);
}

async function runExpiryCheckService() {
    await checkAndExpireSubscriptions();
}

function paymentUnderReviewTemplate(name, plan) {
    return `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background-color:#f4f5f7;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7;padding:40px 20px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:500px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
<tr><td style="background-color:#4f46e5;padding:30px;text-align:center;">
<h1 style="color:#ffffff;font-size:24px;margin:0;font-weight:700;">Linkter</h1></td></tr>
<tr><td style="padding:40px 30px;">
<h2 style="color:#101b31;font-size:20px;margin:0 0 10px;">Hi ${name},</h2>
<p style="color:#64718a;font-size:15px;line-height:1.6;margin:0 0 25px;">
Your <strong>${plan}</strong> premium payment is under review. We'll notify you once it's approved.</p>
<p style="color:#94a3b8;font-size:13px;line-height:1.5;margin:0;">This usually takes within 24 hours.</p>
</td></tr>
<tr><td style="background-color:#f8fafc;padding:20px 30px;text-align:center;border-top:1px solid #e2e8f0;">
<p style="color:#94a3b8;font-size:12px;margin:0;">&copy; ${new Date().getFullYear()} Linkter. All rights reserved.</p>
</td></tr>
</table></td></tr></table>
</body></html>`;
}

function paymentApprovedTemplate(name, plan) {
    const duration = plan === "monthly" ? "1 month" : "1 year";
    return `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background-color:#f4f5f7;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7;padding:40px 20px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:500px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
<tr><td style="background-color:#22c55e;padding:30px;text-align:center;">
<h1 style="color:#ffffff;font-size:24px;margin:0;font-weight:700;">Linkter Premium</h1></td></tr>
<tr><td style="padding:40px 30px;">
<h2 style="color:#101b31;font-size:20px;margin:0 0 10px;">Welcome to Premium, ${name}!</h2>
<p style="color:#64718a;font-size:15px;line-height:1.6;margin:0 0 25px;">
Your <strong>${plan}</strong> subscription is now active for <strong>${duration}</strong>.</p>
<p style="color:#64718a;font-size:15px;line-height:1.6;margin:0 0 25px;">
You can now customize your page with your own branding, highlight links, use platform icons, and more!</p>
<p style="color:#94a3b8;font-size:13px;line-height:1.5;margin:0;">Your subscription will auto-expire after ${duration}.</p>
</td></tr>
<tr><td style="background-color:#f8fafc;padding:20px 30px;text-align:center;border-top:1px solid #e2e8f0;">
<p style="color:#94a3b8;font-size:12px;margin:0;">&copy; ${new Date().getFullYear()} Linkter. All rights reserved.</p>
</td></tr>
</table></td></tr></table>
</body></html>`;
}

function paymentRejectedTemplate(name, reason) {
    return `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background-color:#f4f5f7;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7;padding:40px 20px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:500px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
<tr><td style="background-color:#ef4444;padding:30px;text-align:center;">
<h1 style="color:#ffffff;font-size:24px;margin:0;font-weight:700;">Linkter</h1></td></tr>
<tr><td style="padding:40px 30px;">
<h2 style="color:#101b31;font-size:20px;margin:0 0 10px;">Hi ${name},</h2>
<p style="color:#64718a;font-size:15px;line-height:1.6;margin:0 0 25px;">
Your payment could not be verified.</p>
${reason ? `<p style="color:#ef4444;font-size:14px;margin:0 0 25px;"><strong>Reason:</strong> ${reason}</p>` : ""}
<p style="color:#64718a;font-size:15px;line-height:1.6;margin:0 0 25px;">
Please try again or contact support if you believe this is an error.</p>
</td></tr>
<tr><td style="background-color:#f8fafc;padding:20px 30px;text-align:center;border-top:1px solid #e2e8f0;">
<p style="color:#94a3b8;font-size:12px;margin:0;">&copy; ${new Date().getFullYear()} Linkter. All rights reserved.</p>
</td></tr>
</table></td></tr></table>
</body></html>`;
}

export {
    getPlansService,
    submitPaymentService,
    getMyPaymentsService,
    getPendingPaymentsService,
    approvePaymentService,
    rejectPaymentService,
    getMySubscriptionService,
    runExpiryCheckService,
};