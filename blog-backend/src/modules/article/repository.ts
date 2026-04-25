import { ResultSetHeader, RowDataPacket } from 'mysql2';
import db from '../../db';

export interface ArticleListRow extends RowDataPacket {
  id: number;
  title: string;
  summary: string;
  cover_image: string | null;
  views: number;
  likes: number;
  created_at: string;
  category_name: string | null;
  comment_count: number;
}

export interface ArticleDetailRow extends RowDataPacket {
  id: number;
  title: string;
  summary: string;
  content: string;
  cover_image: string | null;
  category_id: number | null;
  category_name: string | null;
  views: number;
  likes: number;
  status: number;
  source: string;
  ai_key_id: number | null;
  review_status: string | null;
  review_note: string | null;
  created_at: string;
  updated_at: string;
}

export const findPublishedArticles = async (limit: number, offset: number) => {
  const [rows] = await db.query<ArticleListRow[]>(
    `SELECT a.id, a.title, a.summary, a.cover_image, a.views, a.likes, a.created_at, c.name as category_name,
            (SELECT COUNT(*) FROM comments WHERE article_id = a.id AND status = 1) as comment_count
     FROM articles a
     LEFT JOIN categories c ON a.category_id = c.id
     WHERE a.status = 1
     ORDER BY a.created_at DESC
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  const [countRows] = await db.query<RowDataPacket[]>(
    'SELECT COUNT(*) as total FROM articles WHERE status = 1'
  );

  return { list: rows, total: Number(countRows[0].total) };
};

export const queueArticleViewLog = async (input: {
  articleId: number;
  traceId?: string;
  ip?: string;
  userAgent?: string;
}) => {
  await db.query(
    'INSERT INTO article_view_logs (article_id, trace_id, ip_address, user_agent) VALUES (?, ?, ?, ?)',
    [input.articleId, input.traceId || null, input.ip || null, input.userAgent || null]
  );
};

export const flushArticleViewAggregates = async (articleId: number) => {
  await db.query('UPDATE articles SET views = views + 1 WHERE id = ?', [articleId]);
};

export const findPublishedArticleById = async (id: number) => {
  const [rows] = await db.query<ArticleDetailRow[]>(
    `SELECT a.id, a.title, a.summary, a.content, a.cover_image, a.category_id, c.name as category_name,
            a.views, a.likes, a.status, a.source, a.ai_key_id, a.review_status, a.review_note, a.created_at, a.updated_at
     FROM articles a
     LEFT JOIN categories c ON a.category_id = c.id
     WHERE a.id = ? AND a.status = 1`,
    [id]
  );

  return rows[0] || null;
};

export const findArticleByIdForAdmin = async (id: number) => {
  const [rows] = await db.query<ArticleDetailRow[]>(
    `SELECT a.id, a.title, a.summary, a.content, a.cover_image, a.category_id, c.name as category_name,
            a.views, a.likes, a.status, a.source, a.ai_key_id, a.review_status, a.review_note, a.created_at, a.updated_at
     FROM articles a
     LEFT JOIN categories c ON a.category_id = c.id
     WHERE a.id = ?`,
    [id]
  );

  return rows[0] || null;
};

export const incrementArticleLikes = async (id: number) => {
  const [result] = await db.query<ResultSetHeader>('UPDATE articles SET likes = likes + 1 WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

export const saveArticleRecord = async (input: {
  id?: number;
  title: string;
  summary: string;
  content: string;
  categoryId: number;
  status: number;
  source?: string;
  aiKeyId?: number | null;
  reviewStatus?: string | null;
  reviewNote?: string | null;
}) => {
  if (input.id) {
    await db.query(
      `UPDATE articles
       SET title = ?, summary = ?, content = ?, category_id = ?, status = ?,
           source = COALESCE(?, source),
           ai_key_id = COALESCE(?, ai_key_id),
           review_status = COALESCE(?, review_status),
           review_note = COALESCE(?, review_note)
       WHERE id = ?`,
      [
        input.title,
        input.summary,
        input.content,
        input.categoryId,
        input.status,
        input.source ?? null,
        input.aiKeyId ?? null,
        input.reviewStatus ?? null,
        input.reviewNote ?? null,
        input.id,
      ]
    );

    return { id: input.id, created: false };
  }

  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO articles (title, summary, content, category_id, status, source, ai_key_id, review_status, review_note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.title,
      input.summary,
      input.content,
      input.categoryId,
      input.status,
      input.source || 'manual',
      input.aiKeyId || null,
      input.reviewStatus || null,
      input.reviewNote || null,
    ]
  );

  return { id: result.insertId, created: true };
};

export const removeArticleById = async (id: number) => {
  await db.query('DELETE FROM articles WHERE id = ?', [id]);
};
