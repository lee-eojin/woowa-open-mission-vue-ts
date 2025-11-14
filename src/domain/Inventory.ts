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
    const activePromotions = promotions.filter(promotion => promotion.isActive())
    const activePromotionNames = new Set(activePromotions.map(promotion => promotion.name))

    const promotionProduct = products.find(product =>
      product.hasPromotion() && activePromotionNames.has(product.promotion!)
    )

    if (!promotionProduct) {
      return 0
    }

    return promotionProduct.quantity
  }

  getNormalStock(name: string): number {
    const products = this.findByName(name)
    const normalProduct = products.find(product => !product.hasPromotion())

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
      remaining = this.decreasePromotionStock(productName, remaining, promotion)
    }

    if (remaining > 0) {
      this.decreaseNormalStock(productName, remaining)
    }

    this.productMap = this.groupByName(this.products)
  }

  private decreasePromotionStock(productName: string, quantity: number, promotion: Promotion): number {
    const promoIndex = this.findPromotionProductIndex(productName, promotion)

    if (promoIndex === -1) {
      return quantity
    }

    const promoProduct = this.products[promoIndex]
    if (!promoProduct) {
      return quantity
    }

    const deductAmount = Math.min(quantity, promoProduct.quantity)

    this.updateProductQuantity(promoIndex, promoProduct.quantity - deductAmount)

    return quantity - deductAmount
  }

  private decreaseNormalStock(productName: string, quantity: number): void {
    const normalIndex = this.findNormalProductIndex(productName)

    if (normalIndex === -1) {
      return
    }

    const normalProduct = this.products[normalIndex]
    if (!normalProduct) {
      return
    }

    this.updateProductQuantity(normalIndex, normalProduct.quantity - quantity)
  }

  private findPromotionProductIndex(productName: string, promotion: Promotion): number {
    const index = this.products.findIndex(product =>
      product.name === productName && product.hasPromotion() && product.promotion === promotion.name
    )

    return (index !== -1 && this.products[index]) ? index : -1
  }

  private findNormalProductIndex(productName: string): number {
    const index = this.products.findIndex(product =>
      product.name === productName && !product.hasPromotion()
    )

    return (index !== -1 && this.products[index]) ? index : -1
  }

  private updateProductQuantity(index: number, newQuantity: number): void {
    const product = this.products[index]
    if (!product) {
      return
    }

    this.products[index] = new Product(
      product.name,
      product.price,
      newQuantity,
      product.promotion
    )
  }
}
