export class Product {
  constructor(
    private readonly name: string,
    private readonly price: number,
    private readonly quantity: number,
    private readonly promotion: string | null
  ) {}

  getName(): string {
    return this.name
  }

  getPrice(): number {
    return this.price
  }

  getQuantity(): number {
    return this.quantity
  }

  getPromotion(): string | null {
    return this.promotion
  }

  hasPromotion(): boolean {
    return this.promotion !== null
  }

  getTotalPrice(): number {
    return this.price * this.quantity
  }
}
