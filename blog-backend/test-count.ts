import db from './src/db';

async function testCount() {
  try {
    const [countRows] = await db.query('SELECT COUNT(*) as total FROM articles WHERE status = 1');
    console.log('Count success:', countRows);
    process.exit(0);
  } catch (error) {
    console.error('Count failed:', error);
    process.exit(1);
  }
}

testCount();