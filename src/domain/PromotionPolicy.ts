import { Product } from './Product'
import { Promotion } from './Promotion'

export class PromotionPolicy {
  constructor(private readonly promotions: Promotion[]) {}

  findApplicablePromotion(product: Product): Promotion | null {
    if (!product.promotion) return null

    return this.promotions.find(
      p => p.name === product.promotion && p.isActive()
    ) || null
  }
}
