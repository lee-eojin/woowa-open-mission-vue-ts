import { Promotion } from '@/domain'
import { CsvParser } from './csvParser'

function validatePromotionFields(row: Record<string, string>): void {
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
}

function validatePromotionQuantities(buy: number, get: number, rawBuy: string, rawGet: string): void {
  if (isNaN(buy) || buy <= 0) {
    throw new Error(`[ERROR] 잘못된 구매 수량입니다: ${rawBuy}`)
  }

  if (isNaN(get) || get <= 0) {
    throw new Error(`[ERROR] 잘못된 증정 수량입니다: ${rawGet}`)
  }
}

function validatePromotionDates(startDate: Date, endDate: Date, rawStart: string, rawEnd: string): void {
  if (isNaN(startDate.getTime())) {
    throw new Error(`[ERROR] 잘못된 시작 날짜입니다: ${rawStart}`)
  }

  if (isNaN(endDate.getTime())) {
    throw new Error(`[ERROR] 잘못된 종료 날짜입니다: ${rawEnd}`)
  }

  if (startDate > endDate) {
    throw new Error('[ERROR] 시작 날짜가 종료 날짜보다 늦습니다.')
  }
}

function createPromotion(row: Record<string, string>): Promotion {
  const buy = Number(row.buy!)
  const get = Number(row.get!)
  const startDate = new Date(row.start_date!)
  const endDate = new Date(row.end_date!)

  validatePromotionQuantities(buy, get, row.buy!, row.get!)
  validatePromotionDates(startDate, endDate, row.start_date!, row.end_date!)

  return new Promotion(row.name!, buy, get, startDate, endDate)
}

export function parsePromotions(csvText: string): Promotion[] {
  const csvParser = new CsvParser()
  const rawData = csvParser.parse(csvText)

  return rawData.map((row) => {
    validatePromotionFields(row)
    return createPromotion(row)
  })
}
