import db from '../../db';

export const writeAuditLog = async (input: {
  userId?: number;
  action: string;
  resourceType: string;
  resourceId?: string | number | null;
  traceId?: string;
  ip?: string;
  metadata?: unknown;
}) => {
  await db.query(
    `INSERT INTO admin_operation_logs (user_id, action, resource_type, resource_id, trace_id, ip_address, metadata)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      input.userId || null,
      input.action,
      input.resourceType,
      input.resourceId ? String(input.resourceId) : null,
      input.traceId || null,
      input.ip || null,
      input.metadata ? JSON.stringify(input.metadata) : null,
    ]
  );
};
