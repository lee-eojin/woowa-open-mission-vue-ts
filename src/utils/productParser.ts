import { Product } from '@/domain'
import { CsvParser } from './csvParser'

export class ProductParser {
  private static readonly NULL_STRING = 'null'
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
      throw new Error('[ERROR] 상품명이 없습니다.')
    }

    if (!row.price) {
      throw new Error('[ERROR] 가격이 없습니다.')
    }

    if (!row.quantity) {
      throw new Error('[ERROR] 수량이 없습니다.')
    }

    if (!row.promotion) {
      throw new Error('[ERROR] 프로모션 정보가 없습니다.')
    }
  }

  private validateValues(price: number, quantity: number, rawPrice: string, rawQuantity: string): void {
    if (isNaN(price) || price <= 0) {
      throw new Error(`[ERROR] 잘못된 가격입니다: ${rawPrice}`)
    }

    if (isNaN(quantity) || quantity < 0) {
      throw new Error(`[ERROR] 잘못된 수량입니다: ${rawQuantity}`)
    }
  }

  private convertPromotionStringToNullable(promotionString: string): string | null {
    if (promotionString === ProductParser.NULL_STRING) {
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
