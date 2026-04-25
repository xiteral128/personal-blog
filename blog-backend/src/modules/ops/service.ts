import { findRecentOperationLogs } from './repository';

export const listRecentOperationLogs = async (limit = 20) => {
  return findRecentOperationLogs(limit);
};
