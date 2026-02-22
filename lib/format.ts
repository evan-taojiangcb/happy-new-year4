export function formatRelativeCountdown(ms: number): string {
  if (ms <= 0) {
    return "0天 0小时 0分 0秒";
  }

  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${days}天 ${hours}小时 ${minutes}分 ${seconds}秒`;
}

export function formatDateTime(ts: number): string {
  return new Date(ts).toLocaleString("zh-CN", {
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}
