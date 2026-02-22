export function getOrCreateWishUserId(): string {
  const key = "wish_user_id";
  const existing = localStorage.getItem(key);
  if (existing) {
    return existing;
  }

  const id = crypto.randomUUID();
  localStorage.setItem(key, id);
  return id;
}

export function getLocalWishCount(): number {
  return Number(localStorage.getItem("wish_count") ?? "0");
}

export function setLocalWishCount(next: number): void {
  localStorage.setItem("wish_count", String(next));
}
