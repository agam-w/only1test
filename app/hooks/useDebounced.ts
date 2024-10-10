import { useState, useRef } from "react";

export default function useDebounced<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cancelTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const setValue = (newValue: T) => {
    cancelTimeout();
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(newValue);
    }, delay);
  };

  if (value !== debouncedValue) {
    setValue(value);
  }

  return debouncedValue;
}
