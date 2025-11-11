export const UI_MESSAGES = {
  COMMON: {
    QUANTITY_UNIT: '개',
    CURRENCY_UNIT: '원',
    CONFIRM_TEXT: '예',
    CANCEL_TEXT: '아니오'
  },
  APP: {
    STORE_NAME: 'W 편의점'
  },
  PROMOTION_MODAL: {
    MODAL_TITLE: '프로모션 안내',
    ADDITIONAL_FREE_OFFER_MESSAGE: (productName: string, quantity: number) =>
      `현재 ${productName}은(는) ${quantity}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까?`,
    FULL_PRICE_WARNING_MESSAGE: (productName: string, quantity: number) =>
      `현재 ${productName} ${quantity}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까?`
  },
  PRODUCT: {
    OUT_OF_STOCK_TEXT: '재고 없음',
    SOLD_OUT_TEXT: '품절',
    ADD_TO_CART_BUTTON_TEXT: '담기',
    ADD_SUCCESS_MESSAGE: (productName: string, quantity: number) =>
      `${productName} ${quantity}개를 장바구니에 담았습니다!`
  },
  CART: {
    CART_TITLE: '장바구니',
    EMPTY_CART_MESSAGE: '장바구니가 비어있습니다.',
    REMOVE_CONFIRM_MESSAGE: (productName: string) =>
      `${productName}을(를) 장바구니에서 제거하시겠습니까?`,
    TOTAL_PRICE_LABEL: '총 금액',
    PROMOTION_DISCOUNT_LABEL: '프로모션 할인',
    FINAL_PRICE_LABEL: '최종 금액',
    REMOVE_BUTTON_TEXT: '삭제',
    CHECKOUT_BUTTON_TEXT: '결제하기'
  }
} as const
