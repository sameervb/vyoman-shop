import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/cart";

interface CartStore {
  items: CartItem[];
  drawerOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  itemCount: () => number;
  subtotalCents: () => number;
  setDrawerOpen: (open: boolean) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      drawerOpen: false,

      // Replace any existing item with the same photo+productType (no accidental duplicates)
      addItem: (item) =>
        set((state) => {
          const rest = state.items.filter(
            (i) => !(i.photoSlug === item.photoSlug && i.productType === item.productType)
          );
          return { items: [...rest, item] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      clear: () => set({ items: [] }),

      setDrawerOpen: (open) => set({ drawerOpen: open }),

      itemCount: () => get().items.length,

      subtotalCents: () =>
        get().items.reduce((sum, item) => sum + item.priceCents, 0),
    }),
    {
      name: "vyoman-cart",
    }
  )
);
