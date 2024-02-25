import { useEffect, useRef } from "react";

export default function useTimeout(callback: () => void, delay: number) {
  const timeoutRef = useRef<number | null>(null);
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    const tick = () => savedCallback.current();
    timeoutRef.current = window.setTimeout(tick, delay);
    return () => window.clearTimeout(timeoutRef.current!);
  }, [delay]);
  return timeoutRef;
}
