import { Request, Response } from 'express';
import db from '../db';
import { RowDataPacket } from 'mysql2';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT id, name FROM categories');
    res.json({ code: 200, message: 'success', data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: 'Server Error' });
  }
};

export const getTags = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT id, name FROM tags');
    res.json({ code: 200, message: 'success', data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: 'Server Error' });
  }
};