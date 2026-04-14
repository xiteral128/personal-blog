import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth';
import apiRoutes from './routes/api';
import adminRoutes from './routes/admin';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务：对外暴露 public 目录下的上传图片
app.use('/api/v1/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1', apiRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ code: 404, message: 'API Not Found' });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ code: 500, message: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Backend Server is running on http://localhost:${port}`);
});