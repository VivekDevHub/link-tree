import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import apiRoutes from "./index.routes/";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use('/api', apiRoutes);

app.get('/', (req,res) => {
    res.send('Hello World')
})

export default app