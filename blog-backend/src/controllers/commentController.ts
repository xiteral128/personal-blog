import { Request, Response } from 'express';
import db from '../db';
import { RowDataPacket } from 'mysql2';

// 获取所有评论（后台管理用）
export const getAllComments = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT c.id, c.nickname, c.email, c.content, c.status, c.created_at, a.title as article_title
       FROM comments c
       LEFT JOIN articles a ON c.article_id = a.id
       ORDER BY c.created_at DESC
       LIMIT ${limit} OFFSET ${offset}`
    );

    res.json({ code: 200, message: 'success', data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: 'Server Error' });
  }
};

// 更改评论状态（审核通过/拒绝）
export const updateCommentStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (status === undefined) {
    return res.status(400).json({ code: 400, message: 'Status is required' });
  }

  try {
    await db.query('UPDATE comments SET status = ? WHERE id = ?', [status, id]);
    res.json({ code: 200, message: '更新成功', data: null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: 'Server Error' });
  }
};

// 删除评论
export const deleteComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    await db.query('DELETE FROM comments WHERE id = ?', [id]);
    res.json({ code: 200, message: '删除成功', data: null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: 'Server Error' });
  }
};