import { Router } from 'express';
import { saveArticle, deleteArticle, getArticleDetail, getArticleVersions, restoreArticleVersion } from '../controllers/adminController';
import { getDashboardStats } from '../controllers/statsController';
import { getAllComments, updateCommentStatus, deleteCommentHandler } from '../controllers/commentController';
import { uploadImage } from '../controllers/uploadController';
import { rebuildIndex } from '../controllers/searchController';
import { approveAdminAiDraft, createAiKey, listAdminAiDrafts, listAiCallLogs, listAiKeys, rejectAdminAiDraft, revokeAiKey, rotateAiKey } from '../controllers/aiWritingController';
import { authMiddleware } from '../shared/middleware/auth';
import { AppError } from '../shared/errors/appError';
import multer from 'multer';
import path from 'path';
import { ensureUploadDirectory } from '../modules/upload/service';

const router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, ensureUploadDirectory());
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!allowedImageTypes.has(file.mimetype)) {
      cb(new AppError(400, '仅支持 JPG、PNG、WebP 或 GIF 图片'));
      return;
    }
    cb(null, true);
  },
});

router.post('/upload', authMiddleware, upload.single('image'), uploadImage);
router.use(authMiddleware);
router.get('/articles/:id', getArticleDetail);
router.get('/articles/:id/versions', getArticleVersions);
router.post('/articles/:id/versions/:versionId/restore', restoreArticleVersion);
router.post('/articles', saveArticle);
router.delete('/articles/:id', deleteArticle);
router.post('/search/reindex', rebuildIndex);
router.get('/dashboard', getDashboardStats);
router.get('/comments', getAllComments);
router.put('/comments/:id/status', updateCommentStatus);
router.delete('/comments/:id', deleteCommentHandler);
router.get('/ai/keys', listAiKeys);
router.post('/ai/keys', createAiKey);
router.patch('/ai/keys/:id/rotate', rotateAiKey);
router.patch('/ai/keys/:id/revoke', revokeAiKey);
router.get('/ai/calls', listAiCallLogs);
router.get('/ai/drafts', listAdminAiDrafts);
router.post('/ai/drafts/:id/approve', approveAdminAiDraft);
router.post('/ai/drafts/:id/reject', rejectAdminAiDraft);

export default router;
