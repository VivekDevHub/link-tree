import User from "../models/user.model.js";
import Subscription from "../models/subscription.model.js";

async function isPremiumUser(userId) {
    const user = await User.findById(userId).select("role");
    if (!user) return false;
    if (user.role === "admin") return true;

    const sub = await Subscription.findOne({ userId, status: "active" });
    if (!sub) return false;
    if (sub.expiresAt < new Date()) {
        sub.status = "expired";
        await sub.save();
        return false;
    }
    return true;
}

export default isPremiumUser;