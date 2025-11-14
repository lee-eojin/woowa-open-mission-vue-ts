import { describe, it, expect, beforeEach } from 'vitest'
import { Promotion } from '@/domain/Promotion'
import { Product } from '@/domain/Product'

const PROMOTION_NAME = '탄산2+1'
const BUY_QUANTITY = 2
const GET_QUANTITY = 1
const PROMOTION_START_DATE = new Date('2024-01-01')
const PROMOTION_END_DATE = new Date('2024-12-31')

const PRODUCT_NAME = '콜라'
const PRODUCT_PRICE = 1000
const PRODUCT_QUANTITY = 10

const DATE_WITHIN_PERIOD = new Date('2024-06-15')
const DATE_BEFORE_PERIOD = new Date('2023-12-31')
const DATE_AFTER_PERIOD = new Date('2025-01-01')

describe('Promotion', () => {
  let testPromotion: Promotion

  beforeEach(() => {
    testPromotion = new Promotion(PROMOTION_NAME, BUY_QUANTITY, GET_QUANTITY, PROMOTION_START_DATE, PROMOTION_END_DATE)
  })

  it('getTotalQuantity가 buy + get을 반환한다', () => {
    expect(testPromotion.getTotalQuantity()).toBe(3)
  })

  it('현재 날짜가 프로모션 기간 내에 있으면 true를 반환한다', () => {
    expect(testPromotion.isActive(DATE_WITHIN_PERIOD)).toBe(true)
  })

  it('현재 날짜가 프로모션 시작 전이면 false를 반환한다', () => {
    expect(testPromotion.isActive(DATE_BEFORE_PERIOD)).toBe(false)
  })

  it('현재 날짜가 프로모션 종료 후면 false를 반환한다', () => {
    expect(testPromotion.isActive(DATE_AFTER_PERIOD)).toBe(false)
  })

  it('2+1 프로모션에서 6개 구매 시 2개 무료 할인을 계산한다', () => {
    const product = new Product(PRODUCT_NAME, PRODUCT_PRICE, PRODUCT_QUANTITY, PROMOTION_NAME)

    const discount = testPromotion.calculateDiscount(product, 6)

    expect(discount).toBe(2000)
  })

  it('2+1 프로모션에서 5개 구매 시 1개 무료 할인을 계산한다', () => {
    const product = new Product(PRODUCT_NAME, PRODUCT_PRICE, PRODUCT_QUANTITY, PROMOTION_NAME)

    const discount = testPromotion.calculateDiscount(product, 5)

    expect(discount).toBe(1000)
  })

  it('프로모션 세트가 완성되지 않으면 할인이 0이다', () => {
    const product = new Product(PRODUCT_NAME, PRODUCT_PRICE, PRODUCT_QUANTITY, PROMOTION_NAME)

    const discount = testPromotion.calculateDiscount(product, 2)

    expect(discount).toBe(0)
  })
})
