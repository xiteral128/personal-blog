import { RowDataPacket } from 'mysql2';
import db from '../../db';

export const getArticleStats = async () => {
  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT COUNT(*) as total_articles, IFNULL(SUM(views), 0) as total_views, IFNULL(SUM(likes), 0) as total_likes FROM articles'
  );
  return rows[0];
};

export const getCommentStats = async () => {
  const [rows] = await db.query<RowDataPacket[]>('SELECT COUNT(*) as total_comments FROM comments');
  return rows[0];
};

export const getCommentPendingStats = async () => {
  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT COUNT(*) as pending_comments FROM comments WHERE status = 0'
  );
  return rows[0];
};

export const getCategoryStats = async () => {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT c.name, COUNT(a.id) as value
     FROM categories c
     LEFT JOIN articles a ON c.id = a.category_id
     GROUP BY c.id, c.name
     HAVING value > 0`
  );
  return rows;
};

export const getRecentViewTrend = async () => {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as day, COUNT(*) as views
     FROM article_view_logs
     WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 DAY)
     GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
     ORDER BY day ASC`
  );
  return rows;
};
