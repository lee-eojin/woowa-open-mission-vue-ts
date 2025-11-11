import { Product } from '@/domain'
import { CsvParser } from './csvParser'
import { ERROR_MESSAGES } from '@/constants/errorMessages'
import { CONSTANTS } from '@/constants/constants'

export class ProductParser {
  private readonly csvParser: CsvParser

  constructor() {
    this.csvParser = new CsvParser()
  }

  parse(csvText: string): Product[] {
    const rawData = this.csvParser.parse(csvText)
    return rawData.map((row) => this.parseRow(row))
  }

  private parseRow(row: Record<string, string>): Product {
    this.validateFields(row)
    return this.createProduct(row)
  }

  private validateFields(row: Record<string, string>): void {
    if (!row.name || row.name.trim() === '') {
      throw new Error(ERROR_MESSAGES.PRODUCT.MISSING_NAME)
    }

    if (!row.price) {
      throw new Error(ERROR_MESSAGES.PRODUCT.MISSING_PRICE)
    }

    if (!row.quantity) {
      throw new Error(ERROR_MESSAGES.PRODUCT.MISSING_QUANTITY)
    }

    if (!row.promotion) {
      throw new Error(ERROR_MESSAGES.PRODUCT.MISSING_PROMOTION)
    }
  }

  private validateValues(price: number, quantity: number, rawPrice: string, rawQuantity: string): void {
    if (isNaN(price) || price <= 0) {
      throw new Error(ERROR_MESSAGES.PRODUCT.INVALID_PRICE(rawPrice))
    }

    if (isNaN(quantity) || quantity < 0) {
      throw new Error(ERROR_MESSAGES.PRODUCT.INVALID_QUANTITY(rawQuantity))
    }
  }

  private convertPromotionStringToNullable(promotionString: string): string | null {
    if (promotionString === CONSTANTS.VALIDATION.NULL_STRING) {
      return null
    }
    return promotionString
  }

  private createProduct(row: Record<string, string>): Product {
    const price = Number(row.price!)
    const quantity = Number(row.quantity!)

    this.validateValues(price, quantity, row.price!, row.quantity!)

    return new Product(
      row.name!,
      price,
      quantity,
      this.convertPromotionStringToNullable(row.promotion!)
    )
  }
}
