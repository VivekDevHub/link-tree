import API from "../../../lib/axios";

export async function getPlans() {
    const { data } = await API.get("/payments/plans");
    return data.data;
}

export async function submitPayment(plan, screenshot) {
    const { data } = await API.post("/payments/submit", { plan, screenshot });
    return data;
}

export async function getMyPayments() {
    const { data } = await API.get("/payments/my");
    return data.data;
}

export async function getMySubscription() {
    const { data } = await API.get("/payments/subscription");
    return data.data;
}

export async function getPendingPayments() {
    const { data } = await API.get("/payments/admin/pending");
    return data.data;
}

export async function approvePayment(id) {
    const { data } = await API.patch(`/payments/admin/${id}/approve`);
    return data;
}

export async function rejectPayment(id, reason) {
    const { data } = await API.patch(`/payments/admin/${id}/reject`, { reason });
    return data;
}
