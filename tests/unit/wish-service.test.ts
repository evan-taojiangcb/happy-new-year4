import { beforeEach, describe, expect, it } from "vitest";
import { __resetInMemoryWishesForTest } from "@/lib/repository";
import { createWish, listWishes, releaseWishes } from "@/lib/wish-service";

describe("wish-service", () => {
  beforeEach(() => {
    __resetInMemoryWishesForTest();
  });

  it("creates a wish and returns it in list", async () => {
    const result = await createWish({
      userId: crypto.randomUUID(),
      nickname: "张三",
      content: "新年顺利",
      contact: "",
      gender: "male"
    });

    expect("wish" in result).toBe(true);

    const list = await listWishes(20);
    expect(list.wishes).toHaveLength(1);
    expect(list.wishes[0]?.nickname).toBe("张三");
  });

  it("rejects when a user exceeds 3 active wishes", async () => {
    const userId = crypto.randomUUID();
    for (let i = 0; i < 3; i += 1) {
      await createWish({
        userId,
        nickname: `测试${i}`,
        content: "愿望",
        contact: "",
        gender: "secret"
      });
    }

    const result = await createWish({
      userId,
      nickname: "超限",
      content: "第四个",
      contact: "",
      gender: "secret"
    });

    expect("error" in result && result.error).toBe("已达许愿上限");
  });

  it("releases all active wishes", async () => {
    await createWish({
      userId: crypto.randomUUID(),
      nickname: "A",
      content: "B",
      contact: "",
      gender: "female"
    });

    const released = await releaseWishes();
    expect(released.count).toBe(1);

    const list = await listWishes(20);
    expect(list.wishes).toHaveLength(0);
  });
});
