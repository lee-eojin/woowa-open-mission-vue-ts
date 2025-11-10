import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { Cart } from '@/domain/Cart'
import { Inventory } from '@/domain/Inventory'
import { Product } from '@/domain/Product'
import { Promotion } from '@/domain/Promotion'
import { CartItem } from '@/domain/CartItem'

export const useCartStore = defineStore('cart', () => {
  const cart = ref<Cart | null>(null)
  const inventory = ref<Inventory | null>(null)

  const initialize = (products: Product[], promotions: Promotion[]) => {
    cart.value = new Cart(promotions)
    inventory.value = new Inventory(products)
  }

  const addItem = (product: Product, quantity: number) => {
    if (!cart.value || !inventory.value) {
      throw new Error('Cart or Inventory not initialized')
    }

    cart.value.addItem(product, quantity, inventory.value)
  }

  const removeItem = (productName: string) => {
    if (!cart.value) {
      throw new Error('Cart not initialized')
    }

    cart.value.removeItem(productName)
  }

  const updateQuantity = (productName: string, quantity: number) => {
    if (!cart.value || !inventory.value) {
      throw new Error('Cart or Inventory not initialized')
    }

    cart.value.updateQuantity(productName, quantity, inventory.value)
  }

  const clear = () => {
    if (!cart.value) {
      throw new Error('Cart not initialized')
    }

    cart.value.clear()
  }

  const items = computed<CartItem[]>(() => {
    if (!cart.value) return []
    return cart.value.getItems()
  })

  const totalPrice = computed<number>(() => {
    if (!cart.value) return 0
    return cart.value.getTotalPrice()
  })

  const promotionDiscount = computed<number>(() => {
    if (!cart.value) return 0
    return cart.value.getPromotionDiscount()
  })

  const finalPrice = computed<number>(() => {
    if (!cart.value) return 0
    return cart.value.getFinalPrice()
  })

  const isEmpty = computed<boolean>(() => {
    if (!cart.value) return true
    return cart.value.isEmpty()
  })

  return {
    initialize,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    items,
    totalPrice,
    promotionDiscount,
    finalPrice,
    isEmpty
  }
})
