import bcrypt from 'bcryptjs';
import db from './src/db';

async function resetPassword() {
  try {
    const password = 'xjh200501150018';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    
    await db.query('UPDATE users SET password_hash = ? WHERE username = "admin"', [hash]);
    console.log('✅ 密码重置成功！新的 hash 已经写入数据库。');
    process.exit(0);
  } catch (error) {
    console.error('❌ 重置密码失败:', error);
    process.exit(1);
  }
}

resetPassword();