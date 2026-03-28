import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // productId
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CartState {
  items: CartItem[];
  cartCount: number;
  cartTotal: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      cartCount: 0,
      cartTotal: 0,
      
      addItem: (newItem) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === newItem.id);
          let updatedItems;

          if (existingItem) {
            updatedItems = state.items.map((i) =>
              i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i
            );
          } else {
            updatedItems = [...state.items, { ...newItem, quantity: 1 }];
          }

          const cartCount = updatedItems.reduce((acc, curr) => acc + curr.quantity, 0);
          const cartTotal = updatedItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

          return { items: updatedItems, cartCount, cartTotal };
        });
      },

      removeItem: (id) => {
        set((state) => {
          const updatedItems = state.items.filter((i) => i.id !== id);
          const cartCount = updatedItems.reduce((acc, curr) => acc + curr.quantity, 0);
          const cartTotal = updatedItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
          return { items: updatedItems, cartCount, cartTotal };
        });
      },

      updateQuantity: (id, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return get().removeItem(id) as any;
          }
          const updatedItems = state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          );
          const cartCount = updatedItems.reduce((acc, curr) => acc + curr.quantity, 0);
          const cartTotal = updatedItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
          return { items: updatedItems, cartCount, cartTotal };
        });
      },

      clearCart: () => set({ items: [], cartCount: 0, cartTotal: 0 }),
    }),
    {
      name: 'amazon-cart-storage',
    }
  )
);
