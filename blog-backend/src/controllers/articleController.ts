import { Request, Response } from 'express';
import db from '../db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// 获取公开文章列表
export const getArticles = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    // 获取文章列表及对应的评论数
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT a.id, a.title, a.summary, a.cover_image, a.views, a.likes, a.created_at, c.name as category_name,
              (SELECT COUNT(*) FROM comments WHERE article_id = a.id) as comment_count
       FROM articles a 
       LEFT JOIN categories c ON a.category_id = c.id 
       WHERE a.status = 1 
       ORDER BY a.created_at DESC 
       LIMIT ${limit} OFFSET ${offset}`
    );

    const [countRows] = await db.query<RowDataPacket[]>('SELECT COUNT(*) as total FROM articles WHERE status = 1');
    
    res.json({
      code: 200,
      message: 'success',
      data: {
        list: rows,
        total: countRows[0].total
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: 'Server Error' });
  }
};

// 获取文章详情并增加阅读量
export const getArticleDetail = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // 增加阅读量
    await db.query('UPDATE articles SET views = views + 1 WHERE id = ?', [id]);

    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT a.*, c.name as category_name 
       FROM articles a 
       LEFT JOIN categories c ON a.category_id = c.id 
       WHERE a.id = ? AND a.status = 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ code: 404, message: 'Article Not Found' });
    }

    res.json({ code: 200, message: 'success', data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: 'Server Error' });
  }
};

// 点赞文章 (带简单的防刷机制，后端暂时依靠前端 localStorage 或简单 IP/ID 校验，这里先保留基础功能，在前端进行 localStorage 强限制)
export const likeArticle = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [result] = await db.query<ResultSetHeader>('UPDATE articles SET likes = likes + 1 WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ code: 404, message: 'Article Not Found' });
    }
    res.json({ code: 200, message: 'success', data: null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: 'Server Error' });
  }
};

// 获取评论
export const getComments = async (req: Request, res: Response) => {
  const { article_id } = req.query;
  if (!article_id) return res.status(400).json({ code: 400, message: 'Missing article_id' });

  try {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT id, article_id, parent_id, nickname, content, created_at FROM comments WHERE article_id = ? AND status = 1 ORDER BY created_at DESC',
      [article_id]
    );
    res.json({ code: 200, message: 'success', data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: 'Server Error' });
  }
};

// 提交评论
export const createComment = async (req: Request, res: Response) => {
  const { article_id, nickname, email, content, parent_id = 0 } = req.body;
  if (!article_id || !nickname || !email || !content) {
    return res.status(400).json({ code: 400, message: 'Bad Request' });
  }

  try {
    await db.query(
      'INSERT INTO comments (article_id, parent_id, nickname, email, content, status) VALUES (?, ?, ?, ?, ?, 1)',
      [article_id, parent_id, nickname, email, content]
    );
    res.json({ code: 200, message: 'success', data: null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: 'Server Error' });
  }
};