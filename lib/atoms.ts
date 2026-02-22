import { atom } from "jotai";

export const userIdAtom = atom<string>("");
export const wishCountAtom = atom<number>(0);
export const hasReleasedAnimationPlayedAtom = atom<boolean>(false);
