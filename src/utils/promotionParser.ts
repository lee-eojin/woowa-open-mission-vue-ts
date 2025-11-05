import type { Promotion } from '@/types'
import { parseCSV } from './csvParser'

export function parsePromotions(csvText: string): Promotion[] {
  const rawData = parseCSV(csvText)

  return rawData.map((row) => ({
    name: row.name,
    buy: Number(row.buy),
    get: Number(row.get),
    startDate: new Date(row.start_date),
    endDate: new Date(row.end_date)
  }))
}
