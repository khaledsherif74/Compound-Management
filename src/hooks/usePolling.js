import { useEffect, useRef } from 'react';

/**
 * Calls `callback` every `interval` ms while enabled. Pauses while the tab is hidden and
 * refreshes once when it becomes visible again. The latest callback is always used.
 */
export function usePolling(callback, { enabled = true, interval = 5000 } = {}) {
  const saved = useRef(callback);
  useEffect(() => {
    saved.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return undefined;
    let timer = null;
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };
    const start = () => {
      stop();
      timer = setInterval(() => saved.current(), interval);
    };
    const onVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        saved.current();
        start();
      }
    };

    if (!document.hidden) start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [enabled, interval]);
}
