import { useEffect, useState } from 'react';

function useDebounce<T>(value: T): T {
  let [debounce, setDebounce] = useState();

  useEffect(() => {
    const handler = setTimeout(() => setDebounce(value), 500);
    return () => clearTimeout(handler);
  }, [value]);

  return debounce;
}

export { useDebounce };
