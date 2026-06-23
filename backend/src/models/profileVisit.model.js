import mongoose from "mongoose";

const profileVisitSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true
        },
        ip: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

profileVisitSchema.index({ username: 1 });
profileVisitSchema.index({ username: 1, createdAt: 1 });

const ProfileVisit = mongoose.model("ProfileVisit", profileVisitSchema);
export default ProfileVisit;