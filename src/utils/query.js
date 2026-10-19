import { DEFAULT_PAGE_SIZE } from '@/constants/enums';

/** Drops undefined, null and empty-string values so they never reach the query string. */
export const cleanParams = params =>
  Object.fromEntries(
    Object.entries(params ?? {}).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  );

/** Keeps URL-provided paging within the backend limits (page >= 1, limit 1..100). */
export const clampPagination = ({ page, limit }) => ({
  page: Math.max(1, Math.floor(Number(page)) || 1),
  limit: Math.min(100, Math.max(1, Math.floor(Number(limit)) || DEFAULT_PAGE_SIZE)),
});
