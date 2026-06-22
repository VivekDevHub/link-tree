import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import indexRoutes from './routes/index.routes.js';
import ApiError from './utils/ApiError.js';
import ApiResponse from './utils/ApiResponse.js';
import setMiddlewares from "./middlewares/index.middleware.js";
import errorHandler from "./middlewares/error.middleware.js";

function createApp() {
const app = express();
setMiddlewares(app);

app.use(morgan('dev'));      // Setting up morgan for logging every request
app.use(express.json());  //Converts JSON body into JavaScript object.
app.use(cookieParser());  //Parses cookies from incoming requests.
app.use('/api', indexRoutes);

// Send unknown routes to the centralized error handler.
app.use((req,res,next) => {
    next(new ApiError(404, `Route not found: ${req.originalUrl}`))
})

app.use(errorHandler)  //This middleware catches all errors passed using:next(error)


app.get('/health', (req, res) => {
    return ApiResponse(res,200,"server is healthy")
});

return app

}

export default createApp;

// Client Request
//       ↓
// Morgan Logger
//       ↓
// express.json()
//       ↓
// cookieParser()
//       ↓
// Custom Middlewares
//       ↓
// /api Routes
//       ↓
// 404 Middleware
//       ↓
// Error Handler
//       ↓
// Response