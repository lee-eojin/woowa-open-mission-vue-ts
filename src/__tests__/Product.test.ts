import { describe, it, expect } from 'vitest'
import { Product } from '@/domain/Product'

describe('Product', () => {
  it('생성자가 올바르게 값을 할당한다', () => {
    const product = new Product('콜라', 1000, 10, '탄산2+1')

    expect(product.name).toBe('콜라')
    expect(product.price).toBe(1000)
    expect(product.quantity).toBe(10)
    expect(product.promotion).toBe('탄산2+1')
  })

  it('프로모션이 있으면 true를 반환한다', () => {
    const product = new Product('콜라', 1000, 10, '탄산2+1')

    expect(product.hasPromotion()).toBe(true)
  })

  it('프로모션이 없으면 false를 반환한다', () => {
    const product = new Product('콜라', 1000, 10, null)

    expect(product.hasPromotion()).toBe(false)
  })

  it('총 가격을 올바르게 계산한다', () => {
    const product = new Product('콜라', 1000, 10, null)

    expect(product.getTotalPrice()).toBe(10000)
  })
})
