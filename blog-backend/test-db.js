const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  console.log('Testing MySQL Connection...');
  console.log('Host:', process.env.DB_HOST || 'localhost');
  console.log('User:', process.env.DB_USER || 'root');
  console.log('Password:', process.env.DB_PASSWORD || '(empty)');
  console.log('Database:', process.env.DB_NAME || 'my_blog');
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'my_blog'
    });
    console.log('✅ Connection Success! Database exists and credentials are correct.');
    await connection.end();
  } catch (error) {
    console.error('❌ Connection Failed!');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
  }
}

testConnection();