<script setup lang="ts">
import { ref, computed, type PropType } from 'vue'
import PromotionBadge from './PromotionBadge.vue'
import PromotionConfirmModal from './PromotionConfirmModal.vue'
import { Product } from '@/domain/Product'
import { useCartStore } from '@/stores/cartStore'
import { UI_MESSAGES } from '@/constants/uiMessages'
import { CONSTANTS } from '@/constants/constants'

const props = defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true
  },
  isPromotionActive: {
    type: Boolean,
    required: true
  }
})

const cartStore = useCartStore()
const quantity = ref<number>(CONSTANTS.DEFAULT_VALUES.QUANTITY.INITIAL_QUANTITY)

const isModalOpen = ref(false)
const modalType = ref<'additional-free' | 'full-price'>('additional-free')
const modalQuantity = ref<number>(CONSTANTS.DEFAULT_VALUES.QUANTITY.ZERO_QUANTITY)
const pendingQuantity = ref<number>(CONSTANTS.DEFAULT_VALUES.QUANTITY.ZERO_QUANTITY)

const isOutOfStock = computed(() => props.product.quantity === CONSTANTS.DEFAULT_VALUES.QUANTITY.ZERO_QUANTITY)

const formatPrice = (price: number): string => {
  return price.toLocaleString(CONSTANTS.CONFIG.LOCALE.DEFAULT_LOCALE)
}

const getStockText = (quantity: number): string => {
  if (quantity === CONSTANTS.DEFAULT_VALUES.QUANTITY.ZERO_QUANTITY) {
    return UI_MESSAGES.PRODUCT.OUT_OF_STOCK_TEXT
  }
  return `${quantity}${UI_MESSAGES.COMMON.QUANTITY_UNIT}`
}

const addToCart = () => {
  try {
    pendingQuantity.value = quantity.value

    if (props.isPromotionActive) {
      const canGetFree = cartStore.canGetAdditionalFreeItem(props.product, quantity.value)
      if (canGetFree) {
        const promotion = cartStore.findApplicablePromotion(props.product)
        const freeQuantity = promotion?.get || 1
        modalType.value = 'additional-free'
        modalQuantity.value = freeQuantity
        isModalOpen.value = true
        return
      }

      const fullPriceQty = cartStore.calculateFullPriceQuantity(props.product, quantity.value)
      if (fullPriceQty > 0) {
        modalType.value = 'full-price'
        modalQuantity.value = fullPriceQty
        isModalOpen.value = true
        return
      }
    }

    cartStore.addItem(props.product, quantity.value)
    alert(UI_MESSAGES.PRODUCT.ADD_SUCCESS_MESSAGE(props.product.name, quantity.value))
    quantity.value = CONSTANTS.DEFAULT_VALUES.QUANTITY.INITIAL_QUANTITY
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message)
    }
  }
}

const handleModalConfirm = () => {
  try {
    let finalQuantity = pendingQuantity.value

    if (modalType.value === 'additional-free') {
      finalQuantity += modalQuantity.value
    }

    cartStore.addItem(props.product, finalQuantity)
    alert(UI_MESSAGES.PRODUCT.ADD_SUCCESS_MESSAGE(props.product.name, finalQuantity))
    quantity.value = CONSTANTS.DEFAULT_VALUES.QUANTITY.INITIAL_QUANTITY
    isModalOpen.value = false
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message)
    }
    isModalOpen.value = false
  }
}

const handleModalCancel = () => {
  if (modalType.value === 'additional-free') {
    try {
      cartStore.addItem(props.product, pendingQuantity.value)
      alert(UI_MESSAGES.PRODUCT.ADD_SUCCESS_MESSAGE(props.product.name, pendingQuantity.value))
      quantity.value = CONSTANTS.DEFAULT_VALUES.QUANTITY.INITIAL_QUANTITY
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    }
  }
  isModalOpen.value = false
}
</script>

<template>
  <tr :class="{ 'out-of-stock': isOutOfStock }">
    <td class="product-name">{{ product.name }}</td>
    <td class="product-price">{{ formatPrice(product.price) }}{{ UI_MESSAGES.COMMON.CURRENCY_UNIT }}</td>
    <td class="product-quantity">{{ getStockText(product.quantity) }}</td>
    <td class="product-promotion">
      <PromotionBadge
        :promotion-name="product.promotion"
        :is-active="isPromotionActive"
      />
    </td>
    <td class="product-actions">
      <div v-if="!isOutOfStock" class="add-to-cart-container">
        <input
          v-model.number="quantity"
          type="number"
          :min="CONSTANTS.DEFAULT_VALUES.QUANTITY.MIN_QUANTITY"
          :max="product.quantity"
          class="quantity-input"
        />
        <button @click="addToCart" class="add-to-cart-button">{{ UI_MESSAGES.PRODUCT.ADD_TO_CART_BUTTON_TEXT }}</button>
      </div>
      <span v-else class="sold-out">{{ UI_MESSAGES.PRODUCT.SOLD_OUT_TEXT }}</span>
    </td>
  </tr>

  <PromotionConfirmModal
    :isOpen="isModalOpen"
    :type="modalType"
    :productName="product.name"
    :quantity="modalQuantity"
    @confirm="handleModalConfirm"
    @cancel="handleModalCancel"
  />
</template>

<style scoped>
tr {
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

tr:hover {
  background-color: #f8f9fa;
}

tr:last-child {
  border-bottom: none;
}

tr.out-of-stock {
  color: #999;
  background-color: #f5f5f5;
}

td {
  padding: 1rem;
}

.product-name {
  font-weight: 500;
  color: #2c3e50;
}

.product-price {
  color: #e74c3c;
  font-weight: 600;
}

.product-quantity {
  color: #555;
}

.product-promotion {
  text-align: center;
}

.out-of-stock .product-name,
.out-of-stock .product-price,
.out-of-stock .product-quantity {
  color: #999;
}

.product-actions {
  text-align: center;
}

.add-to-cart-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}

.quantity-input {
  width: 60px;
  padding: 0.4rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
  font-size: 0.9rem;
}

.quantity-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.add-to-cart-button {
  padding: 0.5rem 1rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background 0.2s;
}

.add-to-cart-button:hover {
  background: #059669;
}

.sold-out {
  color: #ef4444;
  font-weight: 500;
}
</style>
