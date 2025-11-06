export class Product {
  constructor(
    public readonly name: string,
    public readonly price: number,
    public readonly quantity: number,
    public readonly promotion: string | null
  ) {}

  hasPromotion(): boolean {
    return this.promotion !== null
  }

  getTotalPrice(): number {
    return this.price * this.quantity
  }
}
