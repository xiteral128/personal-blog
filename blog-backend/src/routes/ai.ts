import { Router } from 'express';
import { createAiArticle, getAiArticleDetail, getAiMeta, updateAiArticle } from '../controllers/aiWritingController';
import { aiAuthMiddleware } from '../shared/middleware/aiAuth';
import { aiCallLogMiddleware } from '../shared/middleware/aiCallLog';

const router = Router();

router.use(aiCallLogMiddleware);
router.use(aiAuthMiddleware);
router.get('/meta', getAiMeta);
router.post('/articles', createAiArticle);
router.get('/articles/:id', getAiArticleDetail);
router.put('/articles/:id', updateAiArticle);

export default router;
