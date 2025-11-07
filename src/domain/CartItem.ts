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
}
