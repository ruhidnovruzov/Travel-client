// frontend/src/hooks/useDebounce.js

import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Timeout təyin et ki, dəyər dəyişməyi dayandıranda işə düşsün
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Hər dəyər dəyişdiyində əvvəlki timeout-u təmizlə
    // Bu, hər yeni girişdə əvvəlki timeout-un ləğv edilməsini təmin edir
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Yalnız dəyər və ya gecikmə dəyişdikdə yenidən işə düş

  return debouncedValue;
}

export default useDebounce;
