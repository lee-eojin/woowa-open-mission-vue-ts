import { describe, it, expect, beforeEach } from 'vitest'
import { Cart } from '@/domain/Cart'
import { Product } from '@/domain/Product'
import { Promotion } from '@/domain/Promotion'
import { Inventory } from '@/domain/Inventory'

const PRODUCT_NAME = '콜라'
const PRODUCT_PRICE = 1000
const PROMOTION_NAME = '탄산2+1'
const PROMOTION_STOCK = 10
const NORMAL_STOCK = 10

const OTHER_PRODUCT_NAME = '사이다'
const OTHER_PRODUCT_PRICE = 1500
const OTHER_PRODUCT_STOCK = 50

const PROMOTION_START_DATE = new Date('2025-01-01')
const PROMOTION_END_DATE = new Date('2025-12-31')

describe('Cart', () => {
  let testCart: Cart
  let testPromotions: Promotion[]
  let testInventory: Inventory
  let testProduct: Product
  let testOtherProduct: Product

  beforeEach(() => {
    testPromotions = [
      new Promotion(PROMOTION_NAME, 2, 1, PROMOTION_START_DATE, PROMOTION_END_DATE)
    ]

    const products = [
      new Product(PRODUCT_NAME, PRODUCT_PRICE, PROMOTION_STOCK, PROMOTION_NAME),
      new Product(PRODUCT_NAME, PRODUCT_PRICE, NORMAL_STOCK, null),
      new Product(OTHER_PRODUCT_NAME, OTHER_PRODUCT_PRICE, OTHER_PRODUCT_STOCK, null)
    ]
    testInventory = new Inventory(products)

    testProduct = new Product(PRODUCT_NAME, PRODUCT_PRICE, PROMOTION_STOCK, PROMOTION_NAME)
    testOtherProduct = new Product(OTHER_PRODUCT_NAME, OTHER_PRODUCT_PRICE, OTHER_PRODUCT_STOCK, null)

    testCart = new Cart(testPromotions, testInventory)
  })

  it('상품을 장바구니에 추가한다', () => {
    testCart.addItem(testProduct, 3)

    expect(testCart.getItems()).toHaveLength(1)
  })

  it('장바구니에서 상품을 제거한다', () => {
    testCart.addItem(testProduct, 3)
    testCart.removeItem(PRODUCT_NAME)

    expect(testCart.getItems()).toHaveLength(0)
  })

  it('장바구니 상품의 수량을 변경한다', () => {
    testCart.addItem(testProduct, 3)
    testCart.updateQuantity(PRODUCT_NAME, 6)

    const items = testCart.getItems()
    expect(items[0]?.quantity).toBe(6)
  })

  it('장바구니가 비어있으면 true를 반환한다', () => {
    expect(testCart.isEmpty()).toBe(true)
  })

  it('장바구니에 상품이 있으면 false를 반환한다', () => {
    testCart.addItem(testProduct, 3)

    expect(testCart.isEmpty()).toBe(false)
  })

  it('장바구니를 비운다', () => {
    testCart.addItem(testProduct, 3)
    testCart.clear()

    expect(testCart.isEmpty()).toBe(true)
  })

  it('총 가격을 계산한다', () => {
    testCart.addItem(testProduct, 6)

    expect(testCart.getTotalPrice()).toBe(6000)
  })

  it('프로모션 할인을 계산한다', () => {
    testCart.addItem(testProduct, 6)

    expect(testCart.getPromotionDiscount()).toBe(2000)
  })

  it('무료 증정 상품을 반환한다', () => {
    testCart.addItem(testProduct, 6)

    const freeItems = testCart.getFreeItems()

    expect(freeItems).toHaveLength(1)
    expect(freeItems[0]?.productName).toBe(PRODUCT_NAME)
    expect(freeItems[0]?.quantity).toBe(2)
  })

  it('멤버십 할인을 계산한다', () => {
    testCart.addItem(testOtherProduct, 10)

    const discount = testCart.getMembershipDiscount(true)

    expect(discount).toBe(4500)
  })

  it('멤버십을 사용하지 않으면 할인이 0이다', () => {
    testCart.addItem(testOtherProduct, 10)

    const discount = testCart.getMembershipDiscount(false)

    expect(discount).toBe(0)
  })

  it('멤버십 할인은 최대 8000원이다', () => {
    testCart.addItem(testOtherProduct, 30)

    const discount = testCart.getMembershipDiscount(true)

    expect(discount).toBe(8000)
  })

  it('최종 가격을 계산한다', () => {
    testCart.addItem(testProduct, 6)

    expect(testCart.getFinalPrice()).toBe(4000)
  })

  it('멤버십 사용 시 최종 가격을 계산한다', () => {
    testCart.addItem(testProduct, 6)

    expect(testCart.getFinalPrice(true)).toBe(2800)
  })

  it('결제 시 재고를 차감한다', () => {
    testCart.addItem(testProduct, 6)
    testCart.checkout()

    expect(testInventory.getPromotionStock(PRODUCT_NAME, testPromotions)).toBe(4)
  })

  it('재고가 부족하면 에러를 던진다', () => {
    expect(() => {
      testCart.addItem(testProduct, 30)
    }).toThrow()
  })

  it('존재하지 않는 상품의 수량을 변경하면 에러를 던진다', () => {
    expect(() => {
      testCart.updateQuantity('없는상품', 5)
    }).toThrow()
  })
})
