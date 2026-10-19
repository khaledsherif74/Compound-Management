import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Filters and pagination kept in the URL query string.
 * `update` merges changes, drops empty values and resets `page` to 1 unless `page` itself changes.
 * @param {Record<string, string|number>} defaults values omitted from the URL
 */
export function useQueryParams(defaults = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useMemo(() => {
    const result = { ...defaults };
    searchParams.forEach((value, key) => {
      result[key] = typeof defaults[key] === 'number' ? Number(value) || defaults[key] : value;
    });
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const update = useCallback(
    changes => {
      const next = new URLSearchParams(searchParams);
      Object.entries(changes).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') next.delete(key);
        else next.set(key, String(value));
      });
      if (!('page' in changes)) next.delete('page');
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  return [params, update];
}
