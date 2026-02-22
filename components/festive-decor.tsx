"use client";

const snowItems = Array.from({ length: 18 }, (_, idx) => idx);

export function FestiveDecor() {
  return (
    <>
      <span className="pointer-events-none fixed left-2 top-24 z-10 text-3xl text-pink-100/80">🌸</span>
      <span className="pointer-events-none fixed bottom-24 right-2 z-10 text-3xl text-pink-100/80">🌸</span>
      <div className="pointer-events-none fixed left-0 right-0 top-0 z-30 flex items-start justify-between px-4 py-2 md:px-10">
        <span className="text-4xl text-yellow-300 drop-shadow">🏮</span>
        <span className="rounded-lg border border-yellow-300/60 bg-red-900/70 px-3 py-1 text-lg text-yellow-200">福</span>
        <span className="text-4xl text-yellow-300 drop-shadow">🏮</span>
      </div>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {snowItems.map((item) => (
          <span
            key={item}
            className="absolute top-0 animate-snowFall text-white/80"
            style={{
              left: `${(item * 97) % 100}%`,
              animationDelay: `${(item % 8) * 0.9}s`,
              animationDuration: `${7 + (item % 6)}s`
            }}
          >
            ❄
          </span>
        ))}
      </div>
    </>
  );
}
