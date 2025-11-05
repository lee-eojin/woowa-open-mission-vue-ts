import type { Product } from '@/types'
import { parseCSV } from './csvParser'

const NULL_STRING = 'null'

export function parseProducts(csvText: string): Product[] {
  const rawData = parseCSV(csvText)

  return rawData.map((row) => {
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

    const price = Number(row.price)
    const quantity = Number(row.quantity)

    if (isNaN(price) || price <= 0) {
      throw new Error(`[ERROR] 잘못된 가격입니다: ${row.price}`)
    }

    if (isNaN(quantity) || quantity < 0) {
      throw new Error(`[ERROR] 잘못된 수량입니다: ${row.quantity}`)
    }

    return {
      name: row.name,
      price,
      quantity,
      promotion: row.promotion === NULL_STRING ? null : row.promotion
    }
  })
}
