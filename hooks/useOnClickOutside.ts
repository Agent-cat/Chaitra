import { useEffect, useRef } from "react";

export function useOnClickOutside<T extends HTMLElement>(
  handler: (event: MouseEvent | TouchEvent) => void,
  isActive: boolean = true
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!isActive) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref?.current;
      if (!el || el.contains((event?.target as Node) || null)) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, isActive]);

  return ref;
}
