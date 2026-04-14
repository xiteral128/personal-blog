import { Router } from 'express';
import { getArticles, getArticleDetail, likeArticle, getComments, createComment } from '../controllers/articleController';
import { getCategories, getTags } from '../controllers/metaController';

const router = Router();

// 文章相关
router.get('/articles', getArticles);
router.get('/articles/:id', getArticleDetail);
router.post('/articles/:id/like', likeArticle);

// 分类与标签相关
router.get('/categories', getCategories);
router.get('/tags', getTags);

// 评论相关
router.get('/comments', getComments);
router.post('/comments', createComment);

export default router;