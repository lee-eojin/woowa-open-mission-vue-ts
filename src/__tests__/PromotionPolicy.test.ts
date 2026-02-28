import { describe, it, expect, beforeEach } from 'vitest'
import { PromotionPolicy } from '@/domain/PromotionPolicy'
import { Product } from '@/domain/Product'
import { Promotion } from '@/domain/Promotion'
import { Inventory } from '@/domain/Inventory'

const PRODUCT_NAME = '콜라'
const PRODUCT_PRICE = 1000
const PROMOTION_NAME = '탄산2+1'
const PROMOTION_STOCK = 10
const NORMAL_STOCK = 10

const PROMOTION_START_DATE = new Date('2026-01-01')
const PROMOTION_END_DATE = new Date('2027-12-31')

const EXPIRED_PROMOTION_START_DATE = new Date('2024-01-01')
const EXPIRED_PROMOTION_END_DATE = new Date('2024-12-31')

describe('PromotionPolicy', () => {
  let testPromotionPolicy: PromotionPolicy
  let testPromotions: Promotion[]
  let testInventory: Inventory
  let testProduct: Product
  let testProductWithoutPromotion: Product

  beforeEach(() => {
    testPromotions = [
      new Promotion(PROMOTION_NAME, 2, 1, PROMOTION_START_DATE, PROMOTION_END_DATE)
    ]

    const products = [
      new Product(PRODUCT_NAME, PRODUCT_PRICE, PROMOTION_STOCK, PROMOTION_NAME),
      new Product(PRODUCT_NAME, PRODUCT_PRICE, NORMAL_STOCK, null)
    ]
    testInventory = new Inventory(products)

    testProduct = new Product(PRODUCT_NAME, PRODUCT_PRICE, PROMOTION_STOCK, PROMOTION_NAME)
    testProductWithoutPromotion = new Product(PRODUCT_NAME, PRODUCT_PRICE, NORMAL_STOCK, null)

    testPromotionPolicy = new PromotionPolicy(testPromotions, testInventory)
  })

  it('활성 프로모션을 찾는다', () => {
    const promotion = testPromotionPolicy.findApplicablePromotion(testProduct)

    expect(promotion).not.toBeNull()
    expect(promotion?.name).toBe(PROMOTION_NAME)
  })

  it('프로모션이 없는 상품은 null을 반환한다', () => {
    const promotion = testPromotionPolicy.findApplicablePromotion(testProductWithoutPromotion)

    expect(promotion).toBeNull()
  })

  it('비활성 프로모션은 null을 반환한다', () => {
    const expiredPromotions = [
      new Promotion(PROMOTION_NAME, 2, 1, EXPIRED_PROMOTION_START_DATE, EXPIRED_PROMOTION_END_DATE)
    ]
    const expiredPromotionPolicy = new PromotionPolicy(expiredPromotions, testInventory)

    const promotion = expiredPromotionPolicy.findApplicablePromotion(testProduct)

    expect(promotion).toBeNull()
  })

  it('추가 무료 상품을 받을 수 있는지 확인한다', () => {
    const canGet = testPromotionPolicy.canGetAdditionalFreeItem(testProduct, 2)

    expect(canGet).toBe(true)
  })

  it('프로모션 세트가 완성되지 않으면 추가 무료 상품을 받을 수 없다', () => {
    const canGet = testPromotionPolicy.canGetAdditionalFreeItem(testProduct, 1)

    expect(canGet).toBe(false)
  })

  it('프로모션 재고가 부족하면 추가 무료 상품을 받을 수 없다', () => {
    const canGet = testPromotionPolicy.canGetAdditionalFreeItem(testProduct, 20)

    expect(canGet).toBe(false)
  })

  it('프로모션이 없으면 추가 무료 상품을 받을 수 없다', () => {
    const canGet = testPromotionPolicy.canGetAdditionalFreeItem(testProductWithoutPromotion, 2)

    expect(canGet).toBe(false)
  })

  it('정가로 구매해야 하는 수량을 계산한다', () => {
    const fullPriceQuantity = testPromotionPolicy.calculateFullPriceQuantity(testProduct, 11)

    expect(fullPriceQuantity).toBe(2)
  })

  it('프로모션 재고 내에서 구매하면 정가 수량이 0이다', () => {
    const fullPriceQuantity = testPromotionPolicy.calculateFullPriceQuantity(testProduct, 9)

    expect(fullPriceQuantity).toBe(0)
  })

  it('프로모션이 없으면 정가 수량이 0이다', () => {
    const fullPriceQuantity = testPromotionPolicy.calculateFullPriceQuantity(testProductWithoutPromotion, 5)

    expect(fullPriceQuantity).toBe(0)
  })
})
