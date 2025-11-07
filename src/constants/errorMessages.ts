export const ERROR_MESSAGES = {
  CSV: {
    EMPTY_FILE: '[ERROR] CSV 파일이 비어있습니다.',
    MISSING_HEADER: '[ERROR] 헤더가 없습니다.',
    MISSING_VALUE: (header: string) => `[ERROR] ${header} 값이 없습니다.`
  },
  PRODUCT: {
    MISSING_NAME: '[ERROR] 상품명이 없습니다.',
    MISSING_PRICE: '[ERROR] 가격이 없습니다.',
    MISSING_QUANTITY: '[ERROR] 수량이 없습니다.',
    MISSING_PROMOTION: '[ERROR] 프로모션 정보가 없습니다.',
    INVALID_PRICE: (value: string) => `[ERROR] 잘못된 가격입니다: ${value}`,
    INVALID_QUANTITY: (value: string) => `[ERROR] 잘못된 수량입니다: ${value}`
  },
  PROMOTION: {
    MISSING_NAME: '[ERROR] 프로모션명이 없습니다.',
    MISSING_BUY: '[ERROR] 구매 수량이 없습니다.',
    MISSING_GET: '[ERROR] 증정 수량이 없습니다.',
    MISSING_START_DATE: '[ERROR] 시작 날짜가 없습니다.',
    MISSING_END_DATE: '[ERROR] 종료 날짜가 없습니다.',
    INVALID_BUY: (value: string) => `[ERROR] 잘못된 구매 수량입니다: ${value}`,
    INVALID_GET: (value: string) => `[ERROR] 잘못된 증정 수량입니다: ${value}`,
    INVALID_START_DATE: (value: string) => `[ERROR] 잘못된 시작 날짜입니다: ${value}`,
    INVALID_END_DATE: (value: string) => `[ERROR] 잘못된 종료 날짜입니다: ${value}`,
    INVALID_DATE_RANGE: '[ERROR] 시작 날짜가 종료 날짜보다 늦습니다.'
  },
  INVENTORY: {
    INSUFFICIENT_STOCK: (name: string, requested: number) =>
      `[ERROR] 재고가 부족합니다. 상품: ${name}, 요청 수량: ${requested}`
  },
  CART: {
    ITEM_NOT_FOUND: (name: string) => `[ERROR] 장바구니에 없는 상품입니다: ${name}`
  }
} as const
