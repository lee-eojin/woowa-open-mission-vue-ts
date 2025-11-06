import { Product } from '@/domain'
import { CsvParser } from './csvParser'

const NULL_STRING = 'null'

function validateProductFields(row: Record<string, string>): void {
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

function validateProductValues(price: number, quantity: number, rawPrice: string, rawQuantity: string): void {
  if (isNaN(price) || price <= 0) {
    throw new Error(`[ERROR] 잘못된 가격입니다: ${rawPrice}`)
  }

  if (isNaN(quantity) || quantity < 0) {
    throw new Error(`[ERROR] 잘못된 수량입니다: ${rawQuantity}`)
  }
}

function convertPromotionStringToNullable(promotionString: string): string | null {
  if (promotionString === NULL_STRING) {
    return null
  }
  return promotionString
}

function createProduct(row: Record<string, string>): Product {
  const price = Number(row.price!)
  const quantity = Number(row.quantity!)

  validateProductValues(price, quantity, row.price!, row.quantity!)

  return new Product(
    row.name!,
    price,
    quantity,
    convertPromotionStringToNullable(row.promotion!)
  )
}

export function parseProducts(csvText: string): Product[] {
  const csvParser = new CsvParser()
  const rawData = csvParser.parse(csvText)

  return rawData.map((row) => {
    validateProductFields(row)
    return createProduct(row)
  })
}
