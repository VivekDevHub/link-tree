// importing modules
import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import cookieparser from "cookie-parser";

// Middleware setup
function setMiddlewares(app) {

    // Setting up middlewares
    app.use(helmet());
    app.use(hpp());
    app.use(cors({
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        credentials: true,
    }));
    app.use(compression());
    app.use(express.json());
    app.use(morgan("combined"));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieparser());
} 

export default setMiddlewares;