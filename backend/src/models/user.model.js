import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { JWT_SECRET } from "../config/env.config.js";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: [true, "User already exists with this name"],
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },
        profilePicture: {
            type: String,
            default: "",
        },
        bgColor: {
            type: String,
            default: "#ffffff",
        },
        textColor: {
            type: String,
            default: "#333333",
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        customLogo: {
            type: String,
            default: "",
        },
        customName: {
            type: String,
            default: "",
        },
        removeLinkterBranding: {
            type: Boolean,
            default: false,
        },
        privacyPolicyAccepted: {
            type: Boolean,
            default: false,
        },
        termsAccepted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.set("toJSON", {
    transform(doc, ret) {
        delete ret.password;
        return ret;
    },
});

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateToken = function () {
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    return jwt.sign(
        { id: this._id, email: this.email, username: this.name, role: this.role },
        JWT_SECRET,
        { expiresIn: "7d" }
    );
};

const User = mongoose.model("User", userSchema);
export default User;