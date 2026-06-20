import {config} from "dotenv";

config();  //This line reads the .env file and stores all variables inside:


export const PORT = process.env.PORT || 5000;
export const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/linktree';
export const JWT_SECRET = process.env.JWT_SECRET || "";

