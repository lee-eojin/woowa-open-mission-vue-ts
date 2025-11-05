import type { Product } from '@/types'
import { parseCSV } from './csvParser'

export function parseProducts(csvText: string): Product[] {
  const rawData = parseCSV(csvText)

  return rawData.map((row) => ({
    name: row.name,
    price: Number(row.price),
    quantity: Number(row.quantity),
    promotion: row.promotion === 'null' ? null : row.promotion
  }))
}
