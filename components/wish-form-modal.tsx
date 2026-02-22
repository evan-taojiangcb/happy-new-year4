"use client";

import { FormEvent, useMemo, useState } from "react";
import type { Gender } from "@/lib/types";

type Props = {
  open: boolean;
  remaining: number;
  onClose: () => void;
  onSubmit: (payload: { nickname: string; content: string; contact: string; gender: Gender }) => Promise<void>;
};

export function WishFormModal({ open, remaining, onClose, onSubmit }: Props) {
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [contact, setContact] = useState("");
  const [gender, setGender] = useState<Gender>("secret");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isDisabled = useMemo(() => remaining <= 0 || submitting, [remaining, submitting]);

  if (!open) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!nickname.trim()) {
      setError("昵称必填");
      return;
    }
    if (!content.trim()) {
      setError("愿望内容必填");
      return;
    }
    if (nickname.length > 20 || content.length > 200 || contact.length > 100) {
      setError("请输入符合长度限制的内容");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await onSubmit({ nickname, content, contact, gender });
      setNickname("");
      setContent("");
      setContact("");
      setGender("secret");
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "提交失败");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-[var(--bg-surface)] p-5 shadow-2xl">
        <h2 className="font-display text-xl text-red-900">写下你的新年愿望</h2>
        <p className="mt-1 text-xs text-red-700">剩余许愿次数：{Math.max(remaining, 0)}</p>

        <label className="mt-4 block text-sm">
          昵称（必填）
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={20}
            className="mt-1 h-11 w-full rounded-lg border border-red-200 px-3"
            required
          />
        </label>

        <label className="mt-3 block text-sm">
          愿望内容（必填）
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={200}
            rows={4}
            className="mt-1 w-full rounded-lg border border-red-200 px-3 py-2"
            required
          />
        </label>

        <label className="mt-3 block text-sm">
          联系方式（可选）
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            maxLength={100}
            className="mt-1 h-11 w-full rounded-lg border border-red-200 px-3"
            aria-describedby="contact-tip"
          />
        </label>
        <p id="contact-tip" className="mt-1 text-xs text-red-700">
          请谨慎填写个人信息，本平台仅作展示
        </p>

        <label className="mt-3 block text-sm">
          性别
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
            className="mt-1 h-11 w-full rounded-lg border border-red-200 px-3"
          >
            <option value="secret">保密</option>
            <option value="male">男</option>
            <option value="female">女</option>
          </select>
        </label>

        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            className="h-11 min-w-24 rounded-lg border border-red-200 px-4"
            onClick={onClose}
          >
            取消
          </button>
          <button
            type="submit"
            className="h-11 min-w-24 rounded-lg bg-red-700 px-4 text-white disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isDisabled}
          >
            {submitting ? "提交中..." : "写下愿望"}
          </button>
        </div>
      </form>
    </div>
  );
}
