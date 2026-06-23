import { config } from "dotenv";

config();

export const PORT = process.env.PORT || 5000;
export const MONGO_URI = process.env.MONGO_URI || "";
export const JWT_SECRET = process.env.JWT_SECRET || "";
export const IMAGEKIT_PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY || "";
export const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY || "";
export const IMAGEKIT_URL_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT || "";
export const SMTP_HOST = process.env.SMTP_HOST || "";
export const SMTP_PORT = process.env.SMTP_PORT || "";
export const SMTP_USER = process.env.SMTP_USER || "";
export const SMTP_PASS = process.env.SMTP_PASS || "";
export const SMTP_FROM = process.env.SMTP_FROM || "Linkters <linkters@bhavyadhanwani.dev>";
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";