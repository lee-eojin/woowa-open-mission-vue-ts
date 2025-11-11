export const CONSTANTS = {
  VALIDATION: {
    NULL_STRING: 'null',
  },
  DEFAULT_VALUES: {
    QUANTITY: {
      INITIAL_QUANTITY: 1,
      MIN_QUANTITY: 1,
      ZERO_QUANTITY: 0,
    },
    ARRAY: {
      EMPTY_LENGTH: 0,
    },
  },
  CONFIG: {
    DATA_PATH: {
      PRODUCTS_FILE: '/data/products.md',
      PROMOTIONS_FILE: '/data/promotions.md',
    },
    LOCALE: {
      DEFAULT_LOCALE: 'ko-KR',
    },
    BREAKPOINT: {
      MOBILE_MAX_WIDTH: 1024,
    },
  },
} as const
