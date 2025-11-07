import { Product } from './Product'
import { Promotion } from './Promotion'

export class CartItem {
  constructor(
    public readonly product: Product,
    public readonly quantity: number,
    public readonly promotion: Promotion | null
  ) {}

  getTotalPrice(): number {
    return this.product.price * this.quantity
  }

  getPromotionDiscount(): number {
    if (!this.promotion) return 0

    const promotionSets = Math.floor(this.quantity / this.promotion.getTotalQuantity())
    return promotionSets * this.promotion.get * this.product.price
  }

  getFinalPrice(): number {
    return this.getTotalPrice() - this.getPromotionDiscount()
  }
}
