import { create } from 'zustand'
import initialProducts from '@/mock/products'

const useProductStore = create((set) => ({
  products: initialProducts,

  addProduct: (product) =>
    set((state) => ({
      products: [
        ...state.products,
        { ...product, id: Date.now(), image: product.image || 'https://placehold.co/60x60' },
      ],
    })),

  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  updateProduct: (id, updated) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updated } : p
      ),
    })),
}))

export default useProductStore