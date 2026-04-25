import { ResultSetHeader, RowDataPacket } from 'mysql2';
import db from '../../db';

export interface CommentRow extends RowDataPacket {
  id: number;
  article_id: number;
  parent_id: number;
  nickname: string;
  email?: string;
  content: string;
  status: number;
  created_at: string;
  article_title?: string;
}

export const findApprovedCommentsByArticleId = async (articleId: number) => {
  const [rows] = await db.query<CommentRow[]>(
    `SELECT id, article_id, parent_id, nickname, content, created_at
     FROM comments
     WHERE article_id = ? AND status = 1
     ORDER BY created_at DESC`,
    [articleId]
  );

  return rows;
};

export const insertComment = async (input: {
  articleId: number;
  parentId: number;
  nickname: string;
  email: string;
  content: string;
  status: number;
}) => {
  const [result] = await db.query<ResultSetHeader>(
    'INSERT INTO comments (article_id, parent_id, nickname, email, content, status) VALUES (?, ?, ?, ?, ?, ?)',
    [input.articleId, input.parentId, input.nickname, input.email, input.content, input.status]
  );
  return result.insertId;
};

export const findAllComments = async (limit: number, offset: number, status?: number) => {
  const whereClause = status === undefined ? '' : 'WHERE c.status = ?';
  const params = status === undefined ? [limit, offset] : [status, limit, offset];
  const [rows] = await db.query<CommentRow[]>(
    `SELECT c.id, c.nickname, c.email, c.content, c.status, c.created_at, a.title as article_title
     FROM comments c
     LEFT JOIN articles a ON c.article_id = a.id
     ${whereClause}
     ORDER BY c.created_at DESC
     LIMIT ? OFFSET ?`,
    params
  );
  return rows;
};

export const countCommentsByStatus = async () => {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT status, COUNT(*) as total FROM comments GROUP BY status`
  );
  return rows;
};

export const updateCommentReviewStatus = async (id: number, status: number) => {
  await db.query('UPDATE comments SET status = ? WHERE id = ?', [status, id]);
};

export const removeCommentById = async (id: number) => {
  await db.query('DELETE FROM comments WHERE id = ?', [id]);
};
