import { Request, Response } from 'express';
import db from '../db';
import { RowDataPacket } from 'mysql2';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // 获取总文章数、总阅读量、总点赞数
    const [articleStats] = await db.query<RowDataPacket[]>(
      'SELECT COUNT(*) as total_articles, IFNULL(SUM(views), 0) as total_views, IFNULL(SUM(likes), 0) as total_likes FROM articles'
    );
    
    // 获取总评论数
    const [commentStats] = await db.query<RowDataPacket[]>(
      'SELECT COUNT(*) as total_comments FROM comments'
    );

    // 获取各分类文章数量（用于饼图）
    const [categoryStats] = await db.query<RowDataPacket[]>(
      `SELECT c.name, COUNT(a.id) as value 
       FROM categories c 
       LEFT JOIN articles a ON c.id = a.category_id 
       GROUP BY c.id, c.name 
       HAVING value > 0`
    );

    res.json({
      code: 200,
      message: 'success',
      data: {
        totalArticles: articleStats[0].total_articles,
        totalViews: Number(articleStats[0].total_views),
        totalInteractions: Number(articleStats[0].total_likes) + Number(commentStats[0].total_comments), // 点赞数+评论数
        categoryData: categoryStats
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: 'Server Error' });
  }
};