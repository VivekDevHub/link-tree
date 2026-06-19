import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import apiRoutes from './routes/index.routes.js';


const app = express();


app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use('/api', apiRoutes);


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

export default app;