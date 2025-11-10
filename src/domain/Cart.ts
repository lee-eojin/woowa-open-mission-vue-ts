import { Product } from './Product'
import { Promotion } from './Promotion'
import { Inventory } from './Inventory'
import { CartItem } from './CartItem'
import { PromotionPolicy } from './PromotionPolicy'
import { ERROR_MESSAGES } from '@/constants/errorMessages'

export class Cart {
  private items: Map<string, CartItem>
  private promotionPolicy: PromotionPolicy
  private promotions: Promotion[]
  private inventory: Inventory

  constructor(promotions: Promotion[], inventory: Inventory) {
    this.items = new Map()
    this.promotions = promotions
    this.inventory = inventory
    this.promotionPolicy = new PromotionPolicy(promotions, inventory)
  }

  addItem(product: Product, quantity: number): void {
    this.inventory.validateStock(product.name, quantity, this.promotions)

    const activePromotion = this.promotionPolicy.findApplicablePromotion(product)
    const cartItem = new CartItem(product, quantity, activePromotion)
    this.items.set(product.name, cartItem)
  }

  removeItem(productName: string): void {
    this.items.delete(productName)
  }

  updateQuantity(productName: string, quantity: number): void {
    const item = this.items.get(productName)
    if (!item) {
      throw new Error(ERROR_MESSAGES.CART.ITEM_NOT_FOUND(productName))
    }

    this.inventory.validateStock(productName, quantity, this.promotions)

    const activePromotion = this.promotionPolicy.findApplicablePromotion(item.product)
    const updatedItem = new CartItem(item.product, quantity, activePromotion)
    this.items.set(productName, updatedItem)
  }

  getItems(): CartItem[] {
    return Array.from(this.items.values())
  }

  getTotalPrice(): number {
    return this.getItems().reduce((sum, item) => sum + item.getTotalPrice(), 0)
  }

  getPromotionDiscount(): number {
    return this.getItems().reduce((sum, item) => {
      if (!item.promotion) return sum
      return sum + item.promotion.calculateDiscount(item.product, item.quantity)
    }, 0)
  }

  getFinalPrice(): number {
    return this.getTotalPrice() - this.getPromotionDiscount()
  }

  isEmpty(): boolean {
    return this.items.size === 0
  }

  clear(): void {
    this.items.clear()
  }
}
