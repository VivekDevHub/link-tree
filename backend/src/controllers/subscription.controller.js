import asyncWrapper from "../utils/asyncWrapper.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
    getPlansService,
    submitPaymentService,
    getMyPaymentsService,
    getPendingPaymentsService,
    approvePaymentService,
    rejectPaymentService,
    getMySubscriptionService,
    runExpiryCheckService,
} from "../services/subscription.service.js";

const getPlans = asyncWrapper(async (req, res) => {
    const plans = await getPlansService();
    return ApiResponse(res, 200, "Plans fetched", plans);
});

const submitPayment = asyncWrapper(async (req, res) => {
    const { plan, screenshot } = req.body;
    const result = await submitPaymentService(req.user.id, plan, screenshot);
    return ApiResponse(res, 201, "Payment submitted, under review", result);
});

const getMyPayments = asyncWrapper(async (req, res) => {
    const payments = await getMyPaymentsService(req.user.id);
    return ApiResponse(res, 200, "Payments fetched", payments);
});

const getPendingPayments = asyncWrapper(async (req, res) => {
    const payments = await getPendingPaymentsService();
    return ApiResponse(res, 200, "Pending payments fetched", payments);
});

const approvePayment = asyncWrapper(async (req, res) => {
    const result = await approvePaymentService(req.params.id, req.user.id);
    return ApiResponse(res, 200, "Payment approved", result);
});

const rejectPayment = asyncWrapper(async (req, res) => {
    const { reason } = req.body;
    const result = await rejectPaymentService(req.params.id, req.user.id, reason);
    return ApiResponse(res, 200, "Payment rejected", result);
});

const getMySubscription = asyncWrapper(async (req, res) => {
    const sub = await getMySubscriptionService(req.user.id);
    return ApiResponse(res, 200, "Subscription fetched", sub);
});

const runExpiryCheck = asyncWrapper(async (req, res) => {
    await runExpiryCheckService();
    return ApiResponse(res, 200, "Expiry check completed");
});

export {
    getPlans,
    submitPayment,
    getMyPayments,
    getPendingPayments,
    approvePayment,
    rejectPayment,
    getMySubscription,
    runExpiryCheck,
};