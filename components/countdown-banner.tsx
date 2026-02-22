"use client";

import { useEffect, useMemo, useState } from "react";
import { BEIJING_COUNTDOWN_TARGET_UTC, BEIJING_RELEASE_TIME_UTC } from "@/lib/constants";
import { formatRelativeCountdown } from "@/lib/format";

type Props = {
  onReleaseTimeReached: () => void;
};

export function CountdownBanner({ onReleaseTimeReached }: Props) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= BEIJING_RELEASE_TIME_UTC) {
        onReleaseTimeReached();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [onReleaseTimeReached]);

  const text = useMemo(() => {
    return formatRelativeCountdown(BEIJING_COUNTDOWN_TARGET_UTC - now);
  }, [now]);

  return (
    <section
      className="rounded-2xl border border-yellow-300/60 bg-red-900/70 p-4 text-center text-yellow-100 shadow-card backdrop-blur-sm"
      aria-live="polite"
    >
      <p className="text-sm md:text-base">距离放飞</p>
      <p className="mt-2 animate-countdownPulse text-2xl font-semibold md:text-3xl">{text}</p>
    </section>
  );
}
