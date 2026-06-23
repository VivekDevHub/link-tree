// Importing modules
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import setMiddlewares from "./middlewares/index.middleware.js";
import errorHandler from "./middlewares/error.middleware.js";
import rateLimiter from "./middlewares/rateLimiter.middleware.js";
import ApiError from "./utils/ApiError.js";
import ApiResponse from "./utils/ApiResponse.js";
import indexRouter from "./routes/index.route.js";
import morgan from "morgan";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createApp() {
    const app = express();

    // Setting up middlewares
    setMiddlewares(app);

    // Setting up morgan for logging
    app.use(morgan("dev"));

    // Making the health check route
    app.get("/health", (req, res) => {
        return ApiResponse(res, 200, "Server is healthy");
    });

    // Setting up rate limiter on API routes (100 requests per minute, 5 min block)
    app.use("/api", rateLimiter({ windowMs: 60 * 1000, max: 100, blockDuration: 5 * 60 * 1000 }));

    // Setting up API routes
    app.use("/api", indexRouter);

    // Serving static files from public folder
    app.use(express.static(path.join(__dirname, "../../public")));

    // Send unknown routes to the centralized error handler.
    app.use((req, res, next) => {
        next(new ApiError(404, `Route not found: ${req.originalUrl}`));
    });

    // Setting up error handler
    app.use(errorHandler);

    return app;
}

// Exporting app creator
export default createApp;