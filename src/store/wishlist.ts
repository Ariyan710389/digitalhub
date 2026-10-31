"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface WishlistItem {
  productId: string;
  name: string;
  slug: string;
  featuredImage?: string | null;
  regularPrice: number;
  salePrice?: number | null;
  badge?: string | null;
  categoryName?: string | null;
  categorySlug?: string | null;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  toggleItem: (item: WishlistItem) => boolean; // returns true if added, false if removed
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  getItemCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          if (state.items.some((i) => i.productId === item.productId)) {
            return state;
          }
          return { items: [...state.items, item] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      toggleItem: (item) => {
        const { items } = get();
        const exists = items.some((i) => i.productId === item.productId);
        if (exists) {
          set({ items: items.filter((i) => i.productId !== item.productId) });
          return false;
        } else {
          set({ items: [...items, item] });
          return true;
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((i) => i.productId === productId);
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      getItemCount: () => {
        return get().items.length;
      },
    }),
    {
      name: "digitalhub-wishlist",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
