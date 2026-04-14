import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db';
import { RowDataPacket } from 'mysql2';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ code: 401, message: '用户名或密码错误', data: null });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ code: 401, message: '用户名或密码错误', data: null });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.json({
      code: 200,
      message: '登录成功',
      data: {
        token,
        user: { id: user.id, username: user.username, avatar: user.avatar }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: '服务器错误', data: null });
  }
};