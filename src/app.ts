import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import goalsRouter from '../backend/src/routes/goals';
import authRouter from '../backend/src/routes/auth';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/goals', goalsRouter);
app.use('/api/auth', authRouter);

export default app; 