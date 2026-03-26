// hooks/useCart.ts
import { useState } from 'react'
import type { CartItem } from '../types/resourcePack'

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const addToCart = (item: CartItem) => {
    setCartItems((prev: CartItem[]) => [...prev, item])
  }

  const removeFromCart = (id: string) => {
    setCartItems((prev: CartItem[]) => prev.filter(item => item.id !== id))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const cartTotal = cartItems.reduce((acc: number, item: CartItem) => acc + item.subtotal, 0)

  return {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    cartTotal,
  }
}