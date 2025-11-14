import { describe, it, expect } from 'vitest'
import { Product } from '@/domain/Product'

const PRODUCT_NAME = '콜라'
const PRODUCT_PRICE = 1000
const PRODUCT_QUANTITY = 10
const PROMOTION_NAME = '탄산2+1'

describe('Product', () => {
  it('생성자가 올바르게 값을 할당한다', () => {
    const product = new Product(PRODUCT_NAME, PRODUCT_PRICE, PRODUCT_QUANTITY, PROMOTION_NAME)

    expect(product.name).toBe(PRODUCT_NAME)
    expect(product.price).toBe(PRODUCT_PRICE)
    expect(product.quantity).toBe(PRODUCT_QUANTITY)
    expect(product.promotion).toBe(PROMOTION_NAME)
  })

  it('프로모션이 있으면 true를 반환한다', () => {
    const product = new Product(PRODUCT_NAME, PRODUCT_PRICE, PRODUCT_QUANTITY, PROMOTION_NAME)

    expect(product.hasPromotion()).toBe(true)
  })

  it('프로모션이 없으면 false를 반환한다', () => {
    const product = new Product(PRODUCT_NAME, PRODUCT_PRICE, PRODUCT_QUANTITY, null)

    expect(product.hasPromotion()).toBe(false)
  })

  it('총 가격을 올바르게 계산한다', () => {
    const product = new Product(PRODUCT_NAME, PRODUCT_PRICE, PRODUCT_QUANTITY, null)

    expect(product.getTotalPrice()).toBe(10000)
  })
})
