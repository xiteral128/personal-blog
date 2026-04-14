import db from './src/db';

async function testQuery() {
  try {
    const [rows] = await db.query(
      `SELECT a.id, a.title, a.summary, a.cover_image, a.views, a.likes, a.created_at, c.name as category_name 
       FROM articles a 
       LEFT JOIN categories c ON a.category_id = c.id 
       WHERE a.status = 1 
       ORDER BY a.created_at DESC 
       LIMIT 10 OFFSET 0`
    );
    console.log('Query success:', rows);
    process.exit(0);
  } catch (error) {
    console.error('Query failed:', error);
    process.exit(1);
  }
}

testQuery();