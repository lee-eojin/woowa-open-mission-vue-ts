import { describe, it, expect, beforeEach } from 'vitest'
import { Inventory } from '@/domain/Inventory'
import { Product } from '@/domain/Product'
import { Promotion } from '@/domain/Promotion'

const PRODUCT_NAME = '콜라'
const PRODUCT_PRICE = 1000
const PROMOTION_NAME = '탄산2+1'
const PROMOTION_STOCK = 10
const NORMAL_STOCK = 10

const OTHER_PRODUCT_NAME = '사이다'
const OTHER_PRODUCT_STOCK = 5

const PROMOTION_START_DATE = new Date('2026-01-01')
const PROMOTION_END_DATE = new Date('2027-12-31')

describe('Inventory', () => {
  let testInventory: Inventory
  let testPromotions: Promotion[]

  beforeEach(() => {
    const products = [
      new Product(PRODUCT_NAME, PRODUCT_PRICE, PROMOTION_STOCK, PROMOTION_NAME),
      new Product(PRODUCT_NAME, PRODUCT_PRICE, NORMAL_STOCK, null),
      new Product(OTHER_PRODUCT_NAME, PRODUCT_PRICE, OTHER_PRODUCT_STOCK, null)
    ]
    testInventory = new Inventory(products)

    testPromotions = [
      new Promotion(PROMOTION_NAME, 2, 1, PROMOTION_START_DATE, PROMOTION_END_DATE)
    ]
  })

  it('상품명으로 상품을 찾는다', () => {
    const products = testInventory.findByName(PRODUCT_NAME)

    expect(products).toHaveLength(2)
  })

  it('존재하지 않는 상품은 빈 배열을 반환한다', () => {
    const products = testInventory.findByName('없는상품')

    expect(products).toHaveLength(0)
  })

  it('프로모션 재고를 반환한다', () => {
    const stock = testInventory.getPromotionStock(PRODUCT_NAME, testPromotions)

    expect(stock).toBe(PROMOTION_STOCK)
  })

  it('프로모션이 없는 상품은 프로모션 재고가 0이다', () => {
    const stock = testInventory.getPromotionStock(OTHER_PRODUCT_NAME, testPromotions)

    expect(stock).toBe(0)
  })

  it('일반 재고를 반환한다', () => {
    const stock = testInventory.getNormalStock(PRODUCT_NAME)

    expect(stock).toBe(NORMAL_STOCK)
  })

  it('총 재고를 반환한다', () => {
    const stock = testInventory.getTotalStock(PRODUCT_NAME, testPromotions)

    expect(stock).toBe(20)
  })

  it('재고가 충분하면 true를 반환한다', () => {
    const hasEnough = testInventory.hasEnoughStock(PRODUCT_NAME, 15, testPromotions)

    expect(hasEnough).toBe(true)
  })

  it('재고가 부족하면 false를 반환한다', () => {
    const hasEnough = testInventory.hasEnoughStock(PRODUCT_NAME, 30, testPromotions)

    expect(hasEnough).toBe(false)
  })

  it('재고가 부족하면 에러를 던진다', () => {
    expect(() => {
      testInventory.validateStock(PRODUCT_NAME, 30, testPromotions)
    }).toThrow()
  })

  it('상품이 존재하는지 확인한다', () => {
    expect(testInventory.exists(PRODUCT_NAME)).toBe(true)
    expect(testInventory.exists('없는상품')).toBe(false)
  })

  it('모든 상품명을 반환한다', () => {
    const names = testInventory.getAllProductNames()

    expect(names).toContain(PRODUCT_NAME)
    expect(names).toContain(OTHER_PRODUCT_NAME)
  })

  it('프로모션 재고를 우선 차감한다', () => {
    const promotion = testPromotions[0] as Promotion

    testInventory.decreaseStock(PRODUCT_NAME, 7, promotion)

    expect(testInventory.getPromotionStock(PRODUCT_NAME, testPromotions)).toBe(3)
    expect(testInventory.getNormalStock(PRODUCT_NAME)).toBe(10)
  })

  it('프로모션 재고가 부족하면 일반 재고를 차감한다', () => {
    const promotion = testPromotions[0] as Promotion

    testInventory.decreaseStock(PRODUCT_NAME, 15, promotion)

    expect(testInventory.getPromotionStock(PRODUCT_NAME, testPromotions)).toBe(0)
    expect(testInventory.getNormalStock(PRODUCT_NAME)).toBe(5)
  })

  it('프로모션이 없으면 일반 재고만 차감한다', () => {
    testInventory.decreaseStock(PRODUCT_NAME, 5, null)

    expect(testInventory.getPromotionStock(PRODUCT_NAME, testPromotions)).toBe(10)
    expect(testInventory.getNormalStock(PRODUCT_NAME)).toBe(5)
  })
})
