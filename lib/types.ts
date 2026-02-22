export type Gender = "male" | "female" | "secret";
export type WishStatus = "active" | "released";

export type Wish = {
  wishId: string;
  userId: string;
  nickname: string;
  content: string;
  contact?: string;
  gender: Gender;
  createdAt: number;
  status: WishStatus;
  ttl?: number;
};

export type CreateWishInput = {
  userId: string;
  nickname: string;
  content: string;
  contact?: string;
  gender: Gender;
};

export type ListWishesResult = {
  wishes: Wish[];
  nextToken: string | null;
};
