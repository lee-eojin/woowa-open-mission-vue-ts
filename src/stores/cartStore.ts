import { computed, ref, shallowRef } from 'vue'
import { defineStore } from 'pinia'
import { Cart } from '@/domain/Cart'
import { Inventory } from '@/domain/Inventory'
import { Product } from '@/domain/Product'
import { Promotion } from '@/domain/Promotion'
import { CartItem } from '@/domain/CartItem'
import { ERROR_MESSAGES } from '@/constants/errorMessages'

export const useCartStore = defineStore('cart', () => {
  const cart = ref<Cart | null>(null)
  const inventory = shallowRef<Inventory | null>(null)
  const useMembership = ref(false)

  const initialize = (products: Product[], promotions: Promotion[]) => {
    inventory.value = new Inventory(products)
    cart.value = new Cart(promotions, inventory.value)
  }

  const addItem = (product: Product, quantity: number) => {
    if (!cart.value || !inventory.value) {
      throw new Error(ERROR_MESSAGES.STORE.CART_OR_INVENTORY_NOT_INITIALIZED)
    }

    cart.value.addItem(product, quantity)
  }

  const removeItem = (productName: string) => {
    if (!cart.value) {
      throw new Error(ERROR_MESSAGES.STORE.CART_NOT_INITIALIZED)
    }

    cart.value.removeItem(productName)
  }

  const updateQuantity = (productName: string, quantity: number) => {
    if (!cart.value || !inventory.value) {
      throw new Error(ERROR_MESSAGES.STORE.CART_OR_INVENTORY_NOT_INITIALIZED)
    }

    cart.value.updateQuantity(productName, quantity)
  }

  const clear = () => {
    if (!cart.value) {
      throw new Error(ERROR_MESSAGES.STORE.CART_NOT_INITIALIZED)
    }

    cart.value.clear()
  }

  const setMembership = (value: boolean) => {
    useMembership.value = value
  }

  const checkout = () => {
    if (!cart.value) {
      throw new Error(ERROR_MESSAGES.STORE.CART_NOT_INITIALIZED)
    }

    cart.value.checkout()
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

  const membershipDiscount = computed<number>(() => {
    if (!cart.value) return 0
    return cart.value.getMembershipDiscount(useMembership.value)
  })

  const finalPrice = computed<number>(() => {
    if (!cart.value) return 0
    return cart.value.getFinalPrice(useMembership.value)
  })

  const isEmpty = computed<boolean>(() => {
    if (!cart.value) return true
    return cart.value.isEmpty()
  })

  const freeItems = computed<{ productName: string; quantity: number }[]>(() => {
    if (!cart.value) return []
    return cart.value.getFreeItems()
  })

  const totalQuantity = computed<number>(() => {
    if (!cart.value) return 0
    return cart.value.getItems().reduce((sum, item) => sum + item.quantity, 0)
  })

  const canGetAdditionalFreeItem = (product: Product, quantity: number): boolean => {
    if (!cart.value) {
      throw new Error(ERROR_MESSAGES.STORE.CART_NOT_INITIALIZED)
    }

    return cart.value.canGetAdditionalFreeItem(product, quantity)
  }

  const calculateFullPriceQuantity = (product: Product, quantity: number): number => {
    if (!cart.value) {
      throw new Error(ERROR_MESSAGES.STORE.CART_NOT_INITIALIZED)
    }

    return cart.value.calculateFullPriceQuantity(product, quantity)
  }

  const findApplicablePromotion = (product: Product): Promotion | null => {
    if (!cart.value) {
      throw new Error(ERROR_MESSAGES.STORE.CART_NOT_INITIALIZED)
    }

    return cart.value.findApplicablePromotion(product)
  }

  return {
    initialize,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    setMembership,
    checkout,
    items,
    totalPrice,
    promotionDiscount,
    membershipDiscount,
    finalPrice,
    isEmpty,
    useMembership,
    freeItems,
    totalQuantity,
    canGetAdditionalFreeItem,
    calculateFullPriceQuantity,
    findApplicablePromotion
  }
})
