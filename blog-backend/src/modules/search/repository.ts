import { RowDataPacket } from 'mysql2';
import db from '../../db';

export interface SearchChunkRow extends RowDataPacket {
  id: number;
  article_id: number;
  chunk_index: number;
  content: string;
}

export const listPublishedArticlesForIndexing = async () => {
  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT id, title, summary, content, updated_at FROM articles WHERE status = 1 ORDER BY id ASC'
  );
  return rows;
};

export const replaceArticleChunks = async (articleId: number, chunks: string[]) => {
  await db.query('DELETE FROM article_chunks WHERE article_id = ?', [articleId]);
  for (let index = 0; index < chunks.length; index += 1) {
    await db.query(
      'INSERT INTO article_chunks (article_id, chunk_index, content) VALUES (?, ?, ?)',
      [articleId, index, chunks[index]]
    );
  }
};

export const getArticleChunks = async (articleId: number) => {
  const [rows] = await db.query<SearchChunkRow[]>(
    'SELECT id, article_id, chunk_index, content FROM article_chunks WHERE article_id = ? ORDER BY chunk_index ASC',
    [articleId]
  );
  return rows;
};

export const searchChunksByKeyword = async (keyword: string, limit: number) => {
  const like = `%${keyword}%`;
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT c.article_id, c.content, a.title, a.summary
     FROM article_chunks c
     INNER JOIN articles a ON a.id = c.article_id
     WHERE a.status = 1 AND c.content LIKE ?
     ORDER BY a.updated_at DESC
     LIMIT ?`,
    [like, limit]
  );
  return rows;
};

export const saveEmbeddingSyncLog = async (articleId: number, chunks: number) => {
  await db.query(
    `INSERT INTO article_embedding_jobs (article_id, chunk_count, status)
     VALUES (?, ?, 'done')
     ON DUPLICATE KEY UPDATE chunk_count = VALUES(chunk_count), status = 'done', updated_at = CURRENT_TIMESTAMP`,
    [articleId, chunks]
  );
};

export const findArticleById = async (articleId: number) => {
  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT id, title, summary, content FROM articles WHERE id = ? AND status = 1 LIMIT 1',
    [articleId]
  );
  return rows[0] || null;
};

export const findSimilarArticles = async (articleId: number, limit: number) => {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT id, title, summary
     FROM articles
     WHERE status = 1 AND id <> ?
     ORDER BY updated_at DESC
     LIMIT ?`,
    [articleId, limit]
  );
  return rows;
};
