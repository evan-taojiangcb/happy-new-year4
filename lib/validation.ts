import { z } from "zod";

export const createWishSchema = z.object({
  userId: z.string().uuid(),
  nickname: z.string().trim().min(1, "昵称必填").max(20, "昵称最多20字符"),
  content: z.string().trim().min(1, "愿望内容必填").max(200, "愿望内容最多200字符"),
  contact: z.string().trim().max(100, "联系方式最多100字符").optional().or(z.literal("")),
  gender: z.enum(["male", "female", "secret"])
});

export const listWishQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(20),
  nextToken: z.string().optional()
});
