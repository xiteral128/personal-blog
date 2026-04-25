import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import authRoutes from './routes/auth';
import apiRoutes from './routes/api';
import adminRoutes from './routes/admin';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './shared/middleware/errorHandler';
import { traceIdMiddleware } from './shared/middleware/traceId';

const app = express();

app.set('trust proxy', 1);
app.use(traceIdMiddleware);
app.use(cors({
  origin: env.corsOrigin,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1', apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Backend Server is running on http://localhost:${env.port}`);
});
