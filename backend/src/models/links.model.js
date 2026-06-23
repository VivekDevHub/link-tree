import mongoose from "mongoose";

const linkSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        url: {
            type: String,
            required: true,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            trim: true,
        },
        order: {
            type: Number,
            default: 0,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        isHighlighted: {
            type: Boolean,
            default: false,
        },
        highlightExpiresAt: {
            type: Date,
            default: null,
        },
        platformIcon: {
            type: String,
            default: "",
        },
        customIcon: {
            type: String,
            default: "",
        },
        borderColor: {
            type: String,
            default: "",
        },
        borderWidth: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Link = mongoose.model("Link", linkSchema);
export default Link;