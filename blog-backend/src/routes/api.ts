import { Router } from 'express';
import { getArticles, getArticleDetail, likeArticle, getComments, createComment } from '../controllers/articleController';
import { getCategories, getTags } from '../controllers/metaController';
import { askQuestion, getArticleAssist, getArticleIndexChunks, searchArticles } from '../controllers/searchController';

const router = Router();

router.get('/articles', getArticles);
router.get('/articles/:id', getArticleDetail);
router.post('/articles/:id/like', likeArticle);
router.get('/categories', getCategories);
router.get('/tags', getTags);
router.get('/comments', getComments);
router.post('/comments', createComment);
router.get('/search', searchArticles);
router.post('/search/ask', askQuestion);
router.get('/search/article/:articleId/chunks', getArticleIndexChunks);
router.get('/search/article/:articleId/assist', getArticleAssist);

export default router;
