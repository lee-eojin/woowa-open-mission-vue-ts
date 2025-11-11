import { Promotion } from '@/domain'
import { CsvParser } from './csvParser'
import { ERROR_MESSAGES } from '@/constants/errorMessages'

export class PromotionParser {
  private readonly csvParser: CsvParser

  constructor() {
    this.csvParser = new CsvParser()
  }

  parse(csvText: string): Promotion[] {
    const rawData = this.csvParser.parse(csvText)
    return rawData.map((row) => this.parseRow(row))
  }

  private parseRow(row: Record<string, string>): Promotion {
    this.validateFields(row)
    return this.createPromotion(row)
  }

  private validateFields(row: Record<string, string>): void {
    if (!row.name || row.name.trim() === '') {
      throw new Error(ERROR_MESSAGES.PROMOTION.MISSING_NAME)
    }

    if (!row.buy) {
      throw new Error(ERROR_MESSAGES.PROMOTION.MISSING_BUY_QUANTITY)
    }

    if (!row.get) {
      throw new Error(ERROR_MESSAGES.PROMOTION.MISSING_GET_QUANTITY)
    }

    if (!row.start_date) {
      throw new Error(ERROR_MESSAGES.PROMOTION.MISSING_START_DATE)
    }

    if (!row.end_date) {
      throw new Error(ERROR_MESSAGES.PROMOTION.MISSING_END_DATE)
    }
  }

  private validateQuantities(buy: number, get: number, rawBuy: string, rawGet: string): void {
    if (isNaN(buy) || buy <= 0) {
      throw new Error(ERROR_MESSAGES.PROMOTION.INVALID_BUY_QUANTITY(rawBuy))
    }

    if (isNaN(get) || get <= 0) {
      throw new Error(ERROR_MESSAGES.PROMOTION.INVALID_GET_QUANTITY(rawGet))
    }
  }

  private validateDates(startDate: Date, endDate: Date, rawStart: string, rawEnd: string): void {
    if (isNaN(startDate.getTime())) {
      throw new Error(ERROR_MESSAGES.PROMOTION.INVALID_START_DATE(rawStart))
    }

    if (isNaN(endDate.getTime())) {
      throw new Error(ERROR_MESSAGES.PROMOTION.INVALID_END_DATE(rawEnd))
    }

    if (startDate > endDate) {
      throw new Error(ERROR_MESSAGES.PROMOTION.INVALID_DATE_RANGE)
    }
  }

  private createPromotion(row: Record<string, string>): Promotion {
    const buy = Number(row.buy!)
    const get = Number(row.get!)
    const startDate = new Date(row.start_date!)
    const endDate = new Date(row.end_date!)

    this.validateQuantities(buy, get, row.buy!, row.get!)
    this.validateDates(startDate, endDate, row.start_date!, row.end_date!)

    return new Promotion(row.name!, buy, get, startDate, endDate)
  }
}
