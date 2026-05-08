import { create } from 'zustand'

const useCartStore = create((set, get) => ({
  items: [],

  addItem: (product) => {
    const existing = get().items.find((i) => i.id === product.id)
    if (existing) {
      set((state) => ({
        items: state.items.map((i) =>
          i.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      }))
    } else {
      set((state) => ({
        items: [...state.items, { ...product, quantity: 1 }],
      }))
    }
  },

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  updateQuantity: (id, quantity) => {
    if (quantity < 1) {
      set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      }))
    } else {
      set((state) => ({
        items: state.items.map((i) =>
          i.id === id ? { ...i, quantity } : i
        ),
      }))
    }
  },

  clearCart: () => set({ items: [] }),

  getTotalPrice: () => {
    return get().items.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    )
  },

  getTotalItems: () => {
    return get().items.reduce(
      (sum, item) => sum + item.quantity, 0
    )
  },
}))

export default useCartStore