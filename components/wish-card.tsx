"use client";

import { motion } from "framer-motion";
import { formatDateTime } from "@/lib/format";
import type { Wish } from "@/lib/types";

function genderLabel(gender: Wish["gender"]) {
  if (gender === "male") return "♂";
  if (gender === "female") return "♀";
  return "⚪";
}

type Props = {
  wish: Wish;
  released: boolean;
};

export function WishCard({ wish, released }: Props) {
  return (
    <motion.article
      className="relative mb-4 break-inside-avoid rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-card"
      initial={{ opacity: 0, y: 12, rotate: (wish.createdAt % 7) - 3 }}
      animate={
        released
          ? { opacity: 0, y: -180, rotate: 8, scale: 0.9 }
          : { opacity: 1, y: 0, rotate: (wish.createdAt % 7) - 3, scale: 1 }
      }
      transition={{ duration: released ? 2.8 : 0.25, ease: "easeOut" }}
    >
      <span className="absolute -top-2 left-4 inline-block rounded bg-red-200/90 px-2 py-0.5 text-[10px] text-red-700 shadow-sm">
        福
      </span>
      <header className="flex items-start justify-between gap-2">
        <strong className="text-base text-red-900">{wish.nickname}</strong>
        <span aria-label="性别" className="text-lg text-red-700">
          {genderLabel(wish.gender)}
        </span>
      </header>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--text-primary)]">{wish.content}</p>
      {wish.contact ? <p className="mt-2 text-xs text-[var(--text-muted)]">联系方式：{wish.contact}</p> : null}
      <footer className="mt-3 text-xs text-[var(--text-muted)]">{formatDateTime(wish.createdAt)}</footer>
    </motion.article>
  );
}
