import { useEffect, useMemo, useRef } from 'react';


export function useDebounceCallback<Args extends unknown[]> (
  callback: (...args: Args) => void,
  delay: number) {
    
    // Сохраняем свежую ссылку на функцию, чтобы дебаунс не вызывал старую версию замыкания
    const callbackRef = useRef(callback);
    
    useEffect(() => {
      callbackRef.current = callback;
    }, [callback]);

    // Храним ID таймера в рефе, чтобы он не сбрасывался при рендерах
    const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Очистка таймера
    const cancel = () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };

    // Создаем дебаунс-функцию
    const debouncedFn = useMemo(() => {
      return (...args: Args) => {
        cancel();
        timeoutIdRef.current = setTimeout(() => {
          callbackRef.current(...args);
        }, delay);
      };
    }, [delay]);

    // Автоматически чистим таймер, если компонент удаляется из DOM
    useEffect(() => {
      return cancel;
    }, []);

    return debouncedFn;
}