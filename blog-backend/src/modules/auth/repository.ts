import { RowDataPacket } from 'mysql2';
import db from '../../db';

export interface UserRow extends RowDataPacket {
  id: number;
  username: string;
  password_hash: string;
  avatar: string | null;
}

export const findUserByUsername = async (username: string) => {
  const [rows] = await db.query<UserRow[]>('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0] || null;
};
