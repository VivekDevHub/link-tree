import Subscription from "../models/subscription.model.js";
import PaymentRequest from "../models/paymentRequest.model.js";
import User from "../models/user.model.js";

async function createPaymentRequest(userId, plan, amount, screenshot) {
    return PaymentRequest.create({ userId, plan, amount, screenshot });
}

async function getPaymentRequestsByUser(userId) {
    return PaymentRequest.find({ userId }).sort({ createdAt: -1 });
}

async function getPendingPaymentRequests() {
    return PaymentRequest.find({ status: "pending" })
        .populate("userId", "name email")
        .sort({ createdAt: -1 });
}

async function approvePaymentRequest(paymentId, adminId) {
    const payment = await PaymentRequest.findById(paymentId);
    if (!payment) return null;

    payment.status = "approved";
    payment.reviewedBy = adminId;
    payment.reviewedAt = new Date();
    await payment.save();

    const durationMs = payment.plan === "monthly" ? 30 * 24 * 60 * 60 * 1000 : 365 * 24 * 60 * 60 * 1000;

    await Subscription.deleteMany({ userId: payment.userId, status: "active" });

    const subscription = await Subscription.create({
        userId: payment.userId,
        plan: payment.plan,
        status: "active",
        startDate: new Date(),
        expiresAt: new Date(Date.now() + durationMs),
    });

    await User.findByIdAndUpdate(payment.userId, {
        removeLinkterBranding: true,
    });

    return { payment, subscription };
}

async function rejectPaymentRequest(paymentId, adminId, reason) {
    const payment = await PaymentRequest.findById(paymentId);
    if (!payment) return null;

    payment.status = "rejected";
    payment.reviewedBy = adminId;
    payment.reviewedAt = new Date();
    payment.rejectionReason = reason || "";
    await payment.save();

    return payment;
}

async function getActiveSubscription(userId) {
    const sub = await Subscription.findOne({ userId, status: "active" });
    if (sub && sub.expiresAt < new Date()) {
        sub.status = "expired";
        await sub.save();
        await User.findByIdAndUpdate(userId, { removeLinkterBranding: false });
        return null;
    }
    return sub;
}

async function checkAndExpireSubscriptions() {
    const expired = await Subscription.updateMany(
        { status: "active", expiresAt: { $lt: new Date() } },
        { status: "expired" }
    );
    if (expired.modifiedCount > 0) {
        const expiredSubs = await Subscription.find({ status: "expired" });
        for (const sub of expiredSubs) {
            const hasOtherActive = await Subscription.findOne({ userId: sub.userId, status: "active" });
            if (!hasOtherActive) {
                await User.findByIdAndUpdate(sub.userId, { removeLinkterBranding: false });
            }
        }
    }
}

export {
    createPaymentRequest,
    getPaymentRequestsByUser,
    getPendingPaymentRequests,
    approvePaymentRequest,
    rejectPaymentRequest,
    getActiveSubscription,
    checkAndExpireSubscriptions,
};