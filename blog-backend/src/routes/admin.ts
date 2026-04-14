import { Router } from 'express';
import { saveArticle, deleteArticle } from '../controllers/adminController';
import { getDashboardStats } from '../controllers/statsController';
import { getAllComments, updateCommentStatus, deleteComment } from '../controllers/commentController';
import { uploadImage } from '../controllers/uploadController';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// 配置 Multer 处理图片上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 确保 uploads 文件夹存在
    const uploadDir = path.join(__dirname, '../../public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // 使用时间戳+随机数重命名文件，防止同名覆盖
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 限制 5MB
});

// 简单的 JWT 验证中间件
const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ code: 401, message: '未授权，请先登录' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ code: 401, message: 'Token 无效或已过期' });
  }
};

// =======================
// 上传图片接口 (限制字段名为 image)
// 注意：由于 multer 在解析 multipart/form-data 时可能会有一些异步问题，
// 我们把 upload 接口放在 authMiddleware 前面或者让它单独走一套中间件。
// =======================
router.post('/upload', authMiddleware, upload.single('image'), uploadImage);

router.use(authMiddleware);

// 文章管理接口
router.post('/articles', saveArticle);
router.delete('/articles/:id', deleteArticle);

// 数据统计接口
router.get('/dashboard', getDashboardStats);

// 评论管理接口
router.get('/comments', getAllComments);
router.put('/comments/:id/status', updateCommentStatus);
router.delete('/comments/:id', deleteComment);

export default router;