import { Product } from './Product'
import { Promotion } from './Promotion'
import { Inventory } from './Inventory'

export class PromotionPolicy {
  constructor(
    private readonly promotions: Promotion[],
    private readonly inventory: Inventory
  ) {}

  findApplicablePromotion(product: Product): Promotion | null {
    if (!product.promotion) return null

    return this.promotions.find(
      p => p.name === product.promotion && p.isActive()
    ) || null
  }

  canGetAdditionalFreeItem(product: Product, quantity: number): boolean {
    const promotion = this.findApplicablePromotion(product)
    if (!promotion) return false

    const promotionStock = this.inventory.getPromotionStock(product.name, this.promotions)
    const setQuantity = promotion.getTotalQuantity()
    const remainder = quantity % setQuantity

    if (remainder !== promotion.buy) {
      return false
    }

    return promotionStock >= quantity + promotion.get
  }

  calculateFullPriceQuantity(product: Product, quantity: number): number {
    const promotion = this.findApplicablePromotion(product)
    if (!promotion) return 0

    const promotionStock = this.inventory.getPromotionStock(product.name, this.promotions)
    const setQuantity = promotion.getTotalQuantity()
    const maxSets = Math.floor(promotionStock / setQuantity)
    const maxPromotionQuantity = maxSets * setQuantity

    return Math.max(0, quantity - maxPromotionQuantity)
  }
}
