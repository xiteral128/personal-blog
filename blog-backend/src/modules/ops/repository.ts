import { RowDataPacket } from 'mysql2';
import db from '../../db';

export interface OperationLogRow extends RowDataPacket {
  id: number;
  user_id: number | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  trace_id: string | null;
  ip_address: string | null;
  metadata: string | null;
  created_at: string;
}

export const findRecentOperationLogs = async (limit: number) => {
  const [rows] = await db.query<OperationLogRow[]>(
    `SELECT id, user_id, action, resource_type, resource_id, trace_id, ip_address, metadata, created_at
     FROM admin_operation_logs
     ORDER BY created_at DESC
     LIMIT ?`,
    [limit]
  );
  return rows;
};
