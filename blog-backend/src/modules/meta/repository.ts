import { RowDataPacket } from 'mysql2';
import db from '../../db';

export interface MetaRow extends RowDataPacket {
  id: number;
  name: string;
  description?: string;
}

export const findCategories = async () => {
  const [rows] = await db.query<MetaRow[]>('SELECT id, name, description FROM categories');
  return rows;
};

export const findTags = async () => {
  const [rows] = await db.query<MetaRow[]>('SELECT id, name FROM tags');
  return rows;
};
