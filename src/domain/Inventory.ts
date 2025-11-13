import { Product } from './Product'
import { Promotion } from './Promotion'
import { ERROR_MESSAGES } from '@/constants/errorMessages'

export class Inventory {
  private products: Product[]
  private productMap: Map<string, Product[]>

  constructor(products: Product[]) {
    this.products = products
    this.productMap = this.groupByName(products)
  }

  private groupByName(products: Product[]): Map<string, Product[]> {
    const map = new Map<string, Product[]>()

    products.forEach(product => {
      const name = product.name
      const existing = map.get(name) || []
      map.set(name, [...existing, product])
    })

    return map
  }

  findByName(name: string): Product[] {
    return this.productMap.get(name) || []
  }

  getPromotionStock(name: string, promotions: Promotion[]): number {
    const products = this.findByName(name)
    const activePromotions = promotions.filter(p => p.isActive())
    const activePromotionNames = new Set(activePromotions.map(p => p.name))

    const promotionProduct = products.find(p =>
      p.hasPromotion() && activePromotionNames.has(p.promotion!)
    )

    if (!promotionProduct) {
      return 0
    }

    return promotionProduct.quantity
  }

  getNormalStock(name: string): number {
    const products = this.findByName(name)
    const normalProduct = products.find(p => !p.hasPromotion())

    if (!normalProduct) {
      return 0
    }

    return normalProduct.quantity
  }

  getTotalStock(name: string, promotions: Promotion[]): number {
    return this.getPromotionStock(name, promotions) + this.getNormalStock(name)
  }

  hasEnoughStock(name: string, quantity: number, promotions: Promotion[]): boolean {
    return this.getTotalStock(name, promotions) >= quantity
  }

  validateStock(name: string, quantity: number, promotions: Promotion[]): void {
    if (!this.hasEnoughStock(name, quantity, promotions)) {
      throw new Error(ERROR_MESSAGES.INVENTORY.INSUFFICIENT_STOCK(name, quantity))
    }
  }

  getAllProductNames(): string[] {
    return Array.from(this.productMap.keys())
  }

  exists(name: string): boolean {
    return this.productMap.has(name)
  }

  decreaseStock(productName: string, quantity: number, promotion: Promotion | null): void {
    let remaining = quantity

    if (promotion) {
      const promoIndex = this.products.findIndex(p =>
        p.name === productName && p.hasPromotion() && p.promotion === promotion.name
      )

      if (promoIndex !== -1 && this.products[promoIndex]) {
        const promoProduct = this.products[promoIndex]
        const deductAmount = Math.min(remaining, promoProduct.quantity)

        this.products[promoIndex] = new Product(
          promoProduct.name,
          promoProduct.price,
          promoProduct.quantity - deductAmount,
          promoProduct.promotion
        )

        remaining -= deductAmount
      }
    }

    if (remaining > 0) {
      const normalIndex = this.products.findIndex(p =>
        p.name === productName && !p.hasPromotion()
      )

      if (normalIndex !== -1 && this.products[normalIndex]) {
        const normalProduct = this.products[normalIndex]

        this.products[normalIndex] = new Product(
          normalProduct.name,
          normalProduct.price,
          normalProduct.quantity - remaining,
          normalProduct.promotion
        )
      }
    }

    this.productMap = this.groupByName(this.products)
  }
}
