import { Product } from './Product'
import { Promotion } from './Promotion'
import { ERROR_MESSAGES } from '@/constants/errorMessages'

export class Inventory {
  private readonly products: Product[]
  private readonly productMap: Map<string, Product[]>

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

  canGetAdditionalFreeItem(name: string, quantity: number, promotion: Promotion, promotions: Promotion[]): boolean {
    const promotionStock = this.getPromotionStock(name, promotions)
    const setQuantity = promotion.getTotalQuantity()
    const remainder = quantity % setQuantity

    if (remainder !== promotion.buy) {
      return false
    }

    return promotionStock >= quantity + promotion.get
  }

  calculateFullPriceQuantity(name: string, quantity: number, promotion: Promotion, promotions: Promotion[]): number {
    const promotionStock = this.getPromotionStock(name, promotions)
    const setQuantity = promotion.getTotalQuantity()
    const maxSets = Math.floor(promotionStock / setQuantity)
    const maxPromotionQuantity = maxSets * setQuantity

    return Math.max(0, quantity - maxPromotionQuantity)
  }
}
