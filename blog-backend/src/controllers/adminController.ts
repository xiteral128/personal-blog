import { Request, Response } from 'express';
import db from '../db';
import { ResultSetHeader } from 'mysql2';

// 发布或更新文章
export const saveArticle = async (req: Request, res: Response) => {
  const { id, title, summary, content, category_id = 1, status = 1 } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ code: 400, message: '标题和内容不能为空' });
  }

  try {
    if (id) {
      // 更新文章
      await db.query(
        'UPDATE articles SET title = ?, summary = ?, content = ?, category_id = ?, status = ? WHERE id = ?',
        [title, summary, content, category_id, status, id]
      );
      res.json({ code: 200, message: '更新成功', data: { id } });
    } else {
      // 发布新文章
      const [result] = await db.query<ResultSetHeader>(
        'INSERT INTO articles (title, summary, content, category_id, status) VALUES (?, ?, ?, ?, ?)',
        [title, summary || title.substring(0, 50), content, category_id, status]
      );
      res.json({ code: 200, message: '发布成功', data: { id: result.insertId } });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: 'Server Error' });
  }
};

// 删除文章
export const deleteArticle = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    await db.query('DELETE FROM articles WHERE id = ?', [id]);
    res.json({ code: 200, message: '删除成功', data: null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: 'Server Error' });
  }
};