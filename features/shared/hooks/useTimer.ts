'use client';

import { useEffect, useRef } from 'react';

export function useTimer(
  active: boolean,
  initialSeconds: number,
  onTick: (remaining: number) => void,
  onEnd: () => void
) {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secondsRef = useRef(initialSeconds);

  useEffect(() => {
    if (active) {
      secondsRef.current = initialSeconds;
      timerRef.current = setInterval(() => {
        secondsRef.current -= 1;
        onTick(secondsRef.current);
        if (secondsRef.current <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          onEnd();
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
}
