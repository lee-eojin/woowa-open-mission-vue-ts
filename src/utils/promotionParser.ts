import type { Promotion } from '@/types'
import { parseCSV } from './csvParser'

export function parsePromotions(csvText: string): Promotion[] {
  const rawData = parseCSV(csvText)

  return rawData.map((row) => {
    if (!row.name || row.name.trim() === '') {
      throw new Error('[ERROR] 프로모션명이 없습니다.')
    }

    if (!row.buy) {
      throw new Error('[ERROR] 구매 수량이 없습니다.')
    }

    if (!row.get) {
      throw new Error('[ERROR] 증정 수량이 없습니다.')
    }

    if (!row.start_date) {
      throw new Error('[ERROR] 시작 날짜가 없습니다.')
    }

    if (!row.end_date) {
      throw new Error('[ERROR] 종료 날짜가 없습니다.')
    }

    const buy = Number(row.buy)
    const get = Number(row.get)
    const startDate = new Date(row.start_date)
    const endDate = new Date(row.end_date)

    if (isNaN(buy) || buy <= 0) {
      throw new Error(`[ERROR] 잘못된 구매 수량입니다: ${row.buy}`)
    }

    if (isNaN(get) || get <= 0) {
      throw new Error(`[ERROR] 잘못된 증정 수량입니다: ${row.get}`)
    }

    if (isNaN(startDate.getTime())) {
      throw new Error(`[ERROR] 잘못된 시작 날짜입니다: ${row.start_date}`)
    }

    if (isNaN(endDate.getTime())) {
      throw new Error(`[ERROR] 잘못된 종료 날짜입니다: ${row.end_date}`)
    }

    if (startDate > endDate) {
      throw new Error('[ERROR] 시작 날짜가 종료 날짜보다 늦습니다.')
    }

    return {
      name: row.name,
      buy,
      get,
      startDate,
      endDate
    }
  })
}
