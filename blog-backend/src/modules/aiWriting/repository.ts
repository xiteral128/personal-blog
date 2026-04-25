import { ResultSetHeader, RowDataPacket } from 'mysql2';
import db from '../../db';

export type AiKeyMode = 'autonomous' | 'review';

export interface AiApiKeyRow extends RowDataPacket {
  id: number;
  name: string;
  key_prefix: string;
  key_hash: string;
  mode: AiKeyMode;
  enabled: number;
  daily_limit: number;
  last_used_at: string | null;
  last_used_ip: string | null;
  expires_at: string | null;
  created_by: number | null;
  created_at: string;
  revoked_at: string | null;
}

export interface AiDraftRow extends RowDataPacket {
  id: number;
  title: string;
  summary: string;
  content: string;
  category_id: number | null;
  category_name: string | null;
  status: number;
  source: string;
  ai_key_id: number | null;
  agent_name: string | null;
  agent_mode: AiKeyMode | null;
  review_status: string | null;
  review_note: string | null;
  created_at: string;
  updated_at: string;
}

export const createAiApiKey = async (input: {
  name: string;
  keyPrefix: string;
  keyHash: string;
  mode: AiKeyMode;
  dailyLimit: number;
  expiresAt?: string | null;
  createdBy?: number;
}) => {
  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO ai_api_keys (name, key_prefix, key_hash, mode, daily_limit, expires_at, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      input.name,
      input.keyPrefix,
      input.keyHash,
      input.mode,
      input.dailyLimit,
      input.expiresAt || null,
      input.createdBy || null,
    ]
  );
  return result.insertId;
};

export const findAiApiKeyByHash = async (keyHash: string) => {
  const [rows] = await db.query<AiApiKeyRow[]>(
    'SELECT * FROM ai_api_keys WHERE key_hash = ? LIMIT 1',
    [keyHash]
  );
  return rows[0] || null;
};

export const findAiApiKeyById = async (id: number) => {
  const [rows] = await db.query<AiApiKeyRow[]>(
    'SELECT * FROM ai_api_keys WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
};

export const updateAiApiKeySecret = async (input: { id: number; keyPrefix: string; keyHash: string }) => {
  const [result] = await db.query<ResultSetHeader>(
    `UPDATE ai_api_keys
     SET key_prefix = ?, key_hash = ?, enabled = 1, revoked_at = NULL
     WHERE id = ?`,
    [input.keyPrefix, input.keyHash, input.id]
  );
  return result.affectedRows > 0;
};

export const listAiApiKeys = async () => {
  const [rows] = await db.query<AiApiKeyRow[]>(
    `SELECT id, name, key_prefix, key_hash, mode, enabled, daily_limit, last_used_at, last_used_ip,
            expires_at, created_by, created_at, revoked_at
     FROM ai_api_keys
     ORDER BY created_at DESC`
  );
  return rows;
};

export const revokeAiApiKey = async (id: number) => {
  const [result] = await db.query<ResultSetHeader>(
    'UPDATE ai_api_keys SET enabled = 0, revoked_at = CURRENT_TIMESTAMP WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};

export const touchAiApiKey = async (id: number, ip?: string) => {
  await db.query(
    'UPDATE ai_api_keys SET last_used_at = CURRENT_TIMESTAMP, last_used_ip = ? WHERE id = ?',
    [ip || null, id]
  );
};

export const countAiArticlesCreatedToday = async (keyId: number) => {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT COUNT(*) as total
     FROM articles
     WHERE ai_key_id = ?
       AND created_at >= CURRENT_DATE()`,
    [keyId]
  );
  return Number(rows[0]?.total || 0);
};

export const insertAiArticle = async (input: {
  title: string;
  summary: string;
  content: string;
  categoryId: number;
  status: number;
  keyId: number;
  reviewStatus?: string | null;
}) => {
  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO articles (title, summary, content, category_id, status, source, ai_key_id, review_status)
     VALUES (?, ?, ?, ?, ?, 'ai', ?, ?)`,
    [input.title, input.summary, input.content, input.categoryId, input.status, input.keyId, input.reviewStatus || null]
  );
  return result.insertId;
};

export const updateAiArticle = async (input: {
  id: number;
  keyId: number;
  title: string;
  summary: string;
  content: string;
  categoryId: number;
  status: number;
  reviewStatus?: string | null;
}) => {
  const [result] = await db.query<ResultSetHeader>(
    `UPDATE articles
     SET title = ?, summary = ?, content = ?, category_id = ?, status = ?, review_status = ?
     WHERE id = ? AND ai_key_id = ? AND source = 'ai'`,
    [
      input.title,
      input.summary,
      input.content,
      input.categoryId,
      input.status,
      input.reviewStatus || null,
      input.id,
      input.keyId,
    ]
  );
  return result.affectedRows > 0;
};

export const findAiArticleById = async (id: number, keyId: number) => {
  const [rows] = await db.query<AiDraftRow[]>(
    `SELECT a.id, a.title, a.summary, a.content, a.category_id, c.name as category_name,
            a.status, a.source, a.ai_key_id, k.name as agent_name, k.mode as agent_mode,
            a.review_status, a.review_note, a.created_at, a.updated_at
     FROM articles a
     LEFT JOIN categories c ON c.id = a.category_id
     LEFT JOIN ai_api_keys k ON k.id = a.ai_key_id
     WHERE a.id = ? AND a.ai_key_id = ? AND a.source = 'ai'
     LIMIT 1`,
    [id, keyId]
  );
  return rows[0] || null;
};

export const listAiDrafts = async (status?: number) => {
  const params: unknown[] = [];
  let statusClause = '';
  if (status !== undefined) {
    statusClause = 'AND a.status = ?';
    params.push(status);
  }

  const [rows] = await db.query<AiDraftRow[]>(
    `SELECT a.id, a.title, a.summary, a.content, a.category_id, c.name as category_name,
            a.status, a.source, a.ai_key_id, k.name as agent_name, k.mode as agent_mode,
            a.review_status, a.review_note, a.created_at, a.updated_at
     FROM articles a
     LEFT JOIN categories c ON c.id = a.category_id
     LEFT JOIN ai_api_keys k ON k.id = a.ai_key_id
     WHERE a.source = 'ai' ${statusClause}
     ORDER BY a.updated_at DESC
     LIMIT 100`,
    params
  );
  return rows;
};

export const reviewAiDraft = async (input: {
  id: number;
  status: number;
  reviewStatus: 'approved' | 'rejected';
  reviewNote?: string | null;
  reviewedBy?: number;
}) => {
  const [result] = await db.query<ResultSetHeader>(
    `UPDATE articles
     SET status = ?, review_status = ?, review_note = ?, reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP
     WHERE id = ? AND source = 'ai'`,
    [
      input.status,
      input.reviewStatus,
      input.reviewNote || null,
      input.reviewedBy || null,
      input.id,
    ]
  );
  return result.affectedRows > 0;
};
