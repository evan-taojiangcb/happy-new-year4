import { WISH_LIMIT_PER_USER } from "@/lib/constants";
import { getWishRepository } from "@/lib/repository";
import { escapeHtml } from "@/lib/sanitize";
import type { CreateWishInput } from "@/lib/types";

export async function listWishes(limit: number, nextToken?: string) {
  return getWishRepository().listActive(limit, nextToken);
}

export async function createWish(input: CreateWishInput) {
  const repo = getWishRepository();
  const activeCount = await repo.countActiveByUser(input.userId);

  if (activeCount >= WISH_LIMIT_PER_USER) {
    return { error: "已达许愿上限", statusCode: 403 as const };
  }

  const wish = await repo.create({
    ...input,
    nickname: escapeHtml(input.nickname.trim()),
    content: escapeHtml(input.content.trim()),
    contact: input.contact ? escapeHtml(input.contact.trim()) : ""
  });

  return { wish, statusCode: 201 as const };
}

export async function releaseWishes() {
  const count = await getWishRepository().releaseAll();
  return { count };
}
