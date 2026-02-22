"use client";

import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { BEIJING_RELEASE_TIME_UTC, WISH_LIMIT_PER_USER } from "@/lib/constants";
import { hasReleasedAnimationPlayedAtom, userIdAtom, wishCountAtom } from "@/lib/atoms";
import { getLocalWishCount, getOrCreateWishUserId, setLocalWishCount } from "@/lib/user-id";
import type { Wish } from "@/lib/types";
import { CountdownBanner } from "@/components/countdown-banner";
import { WishCard } from "@/components/wish-card";
import { WishFormModal } from "@/components/wish-form-modal";

type WishesResponse = {
  wishes: Wish[];
  nextToken: string | null;
};

export function WishWallClient() {
  const [items, setItems] = useState<Wish[]>([]);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [released, setReleased] = useState(false);
  const [toast, setToast] = useState("");
  const [userId, setUserId] = useAtom(userIdAtom);
  const [wishCount, setWishCount] = useAtom(wishCountAtom);
  const [hasPlayedReleaseAnimation, setHasPlayedReleaseAnimation] = useAtom(hasReleasedAnimationPlayedAtom);

  const { ref: loadMoreRef, inView } = useInView({ threshold: 0 });

  const remaining = WISH_LIMIT_PER_USER - wishCount;

  const fetchWishes = useCallback(
    async (append: boolean) => {
      if (loading) {
        return;
      }
      setLoading(true);
      setError("");
      try {
        const query = new URLSearchParams({ limit: "20" });
        if (append && nextToken) {
          query.set("nextToken", nextToken);
        }

        const res = await fetch(`/api/wishes?${query.toString()}`);
        if (!res.ok) {
          throw new Error("加载愿望失败，请稍后重试");
        }
        const data = (await res.json()) as WishesResponse;
        setItems((prev) => (append ? [...prev, ...data.wishes] : data.wishes));
        setNextToken(data.nextToken);
      } catch (e) {
        setError(e instanceof Error ? e.message : "加载失败");
      } finally {
        setLoading(false);
      }
    },
    [loading, nextToken]
  );

  useEffect(() => {
    const id = getOrCreateWishUserId();
    setUserId(id);
    setWishCount(getLocalWishCount());
    const alreadyPlayed = localStorage.getItem("wish_release_animation_played") === "1";
    setHasPlayedReleaseAnimation(alreadyPlayed);
  }, [setHasPlayedReleaseAnimation, setUserId, setWishCount]);

  useEffect(() => {
    fetchWishes(false).catch(() => undefined);
  }, [fetchWishes]);

  useEffect(() => {
    if (inView && nextToken) {
      fetchWishes(true).catch(() => undefined);
    }
  }, [fetchWishes, inView, nextToken]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(""), 2000);
      return () => clearTimeout(t);
    }
    return;
  }, [toast]);

  const blessing = useMemo(
    () => (released ? "愿所有美好如期而至，新年快乐！" : ""),
    [released]
  );

  async function submitWish(payload: { nickname: string; content: string; contact: string; gender: Wish["gender"] }) {
    if (remaining <= 0) {
      throw new Error("您最多只能许3个愿望哦");
    }

    const res = await fetch("/api/wishes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        nickname: payload.nickname,
        content: payload.content,
        contact: payload.contact,
        gender: payload.gender
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error ?? "提交失败");
    }

    const nextCount = wishCount + 1;
    setWishCount(nextCount);
    setLocalWishCount(nextCount);
    setItems((prev) => [data.wish as Wish, ...prev]);
    setToast("愿望已写下");
  }

  function triggerReleaseAnimation() {
    if (hasPlayedReleaseAnimation || Date.now() < BEIJING_RELEASE_TIME_UTC) {
      return;
    }
    setReleased(true);
    localStorage.setItem("wish_release_animation_played", "1");
    setHasPlayedReleaseAnimation(true);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
      <header className="mb-6 space-y-4">
        <h1 className="font-display text-3xl text-yellow-100 drop-shadow md:text-5xl">2026 除夕许愿墙</h1>
        <CountdownBanner onReleaseTimeReached={triggerReleaseAnimation} />
      </header>

      {blessing ? (
        <p className="mb-4 rounded-xl bg-yellow-300/90 p-4 text-center text-lg font-semibold text-red-900">{blessing}</p>
      ) : null}

      {error ? <p className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">{error}</p> : null}

      <section className="masonry-columns" aria-label="许愿卡片列表">
        {items.map((wish) => (
          <WishCard key={wish.wishId} wish={wish} released={released} />
        ))}
      </section>

      {loading ? <p className="mt-3 text-center text-sm text-yellow-100">加载中...</p> : null}
      {!nextToken && items.length > 0 ? <p className="mt-3 text-center text-sm text-yellow-100">没有更多愿望了</p> : null}
      <div ref={loadMoreRef} className="h-8" aria-hidden="true" />

      <button
        type="button"
        onClick={() => setFormOpen(true)}
        className="fixed bottom-6 right-6 z-40 h-16 min-w-16 rounded-2xl border-2 border-yellow-400 bg-red-700 px-4 text-sm font-semibold text-yellow-100 shadow-xl"
        aria-label="写愿望"
      >
        红包写愿望
      </button>

      <WishFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        remaining={remaining}
        onSubmit={submitWish}
      />

      {toast ? (
        <p className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-lg bg-black/80 px-4 py-2 text-sm text-white">{toast}</p>
      ) : null}
    </main>
  );
}
