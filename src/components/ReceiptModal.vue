<script setup lang="ts">
import BaseModal from './BaseModal.vue'
import { useCartStore } from '@/stores/cartStore'
import { UI_MESSAGES } from '@/constants/uiMessages'
import { CONSTANTS } from '@/constants/constants'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const cartStore = useCartStore()

const formatPrice = (price: number): string => {
  return price.toLocaleString(CONSTANTS.CONFIG.LOCALE.DEFAULT_LOCALE)
}

const handleConfirm = () => {
  emit('close')
}
</script>

<template>
  <BaseModal :isOpen="isOpen" :title="UI_MESSAGES.RECEIPT.RECEIPT_TITLE" @close="handleConfirm">
    <div class="receipt-content">
      <div class="receipt-header">
        <h2>{{ UI_MESSAGES.RECEIPT.STORE_HEADER }}</h2>
      </div>

      <div class="receipt-section">
        <h3>{{ UI_MESSAGES.RECEIPT.PURCHASE_SECTION_TITLE }}</h3>
        <table class="receipt-table">
          <thead>
            <tr>
              <th>{{ UI_MESSAGES.RECEIPT.PRODUCT_NAME_LABEL }}</th>
              <th>{{ UI_MESSAGES.RECEIPT.QUANTITY_LABEL }}</th>
              <th>{{ UI_MESSAGES.RECEIPT.AMOUNT_LABEL }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cartStore.items" :key="item.product.name">
              <td>{{ item.product.name }}</td>
              <td>{{ item.quantity }}{{ UI_MESSAGES.COMMON.QUANTITY_UNIT }}</td>
              <td>{{ formatPrice(item.getTotalPrice()) }}{{ UI_MESSAGES.COMMON.CURRENCY_UNIT }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="cartStore.freeItems.length > 0" class="receipt-section">
        <h3>{{ UI_MESSAGES.RECEIPT.FREE_ITEM_SECTION_TITLE }}</h3>
        <table class="receipt-table">
          <tbody>
            <tr v-for="freeItem in cartStore.freeItems" :key="freeItem.productName">
              <td>{{ freeItem.productName }}</td>
              <td>{{ freeItem.quantity }}{{ UI_MESSAGES.COMMON.QUANTITY_UNIT }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="receipt-summary">
        <div class="summary-row">
          <span>{{ UI_MESSAGES.RECEIPT.TOTAL_QUANTITY_LABEL }}</span>
          <span>{{ cartStore.totalQuantity }}{{ UI_MESSAGES.COMMON.QUANTITY_UNIT }}</span>
          <span>{{ formatPrice(cartStore.totalPrice) }}{{ UI_MESSAGES.COMMON.CURRENCY_UNIT }}</span>
        </div>
        <div v-if="cartStore.promotionDiscount > 0" class="summary-row">
          <span>{{ UI_MESSAGES.RECEIPT.PROMOTION_DISCOUNT_LABEL }}</span>
          <span></span>
          <span>-{{ formatPrice(cartStore.promotionDiscount) }}{{ UI_MESSAGES.COMMON.CURRENCY_UNIT }}</span>
        </div>
        <div v-if="cartStore.membershipDiscount > 0" class="summary-row">
          <span>{{ UI_MESSAGES.RECEIPT.MEMBERSHIP_DISCOUNT_LABEL }}</span>
          <span></span>
          <span>-{{ formatPrice(cartStore.membershipDiscount) }}{{ UI_MESSAGES.COMMON.CURRENCY_UNIT }}</span>
        </div>
        <div class="summary-row final">
          <span>{{ UI_MESSAGES.RECEIPT.FINAL_AMOUNT_LABEL }}</span>
          <span></span>
          <span>{{ formatPrice(cartStore.finalPrice) }}{{ UI_MESSAGES.COMMON.CURRENCY_UNIT }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <button @click="handleConfirm" class="confirm-button">
        {{ UI_MESSAGES.RECEIPT.CONFIRM_BUTTON_TEXT }}
      </button>
    </template>
  </BaseModal>
</template>

<style scoped>
.receipt-content {
  font-family: 'Courier New', monospace;
}

.receipt-header {
  text-align: center;
  padding: 1rem 0;
  border-bottom: 2px solid #333;
  margin-bottom: 1.5rem;
}

.receipt-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
}

.receipt-section {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed #ccc;
}

.receipt-section h3 {
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
}

.receipt-table {
  width: 100%;
  border-collapse: collapse;
}

.receipt-table thead th {
  text-align: left;
  padding: 0.5rem;
  border-bottom: 1px solid #ddd;
  font-size: 0.9rem;
}

.receipt-table tbody td {
  padding: 0.5rem;
  font-size: 0.9rem;
}

.receipt-table tbody td:nth-child(2),
.receipt-table tbody td:nth-child(3),
.receipt-table thead th:nth-child(2),
.receipt-table thead th:nth-child(3) {
  text-align: right;
}

.receipt-summary {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #333;
}

.summary-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;
  padding: 0.5rem 0;
  font-size: 0.95rem;
}

.summary-row span:nth-child(2),
.summary-row span:nth-child(3) {
  text-align: right;
}

.summary-row.final {
  font-weight: bold;
  font-size: 1.1rem;
  border-top: 1px solid #333;
  margin-top: 0.5rem;
  padding-top: 1rem;
}

.confirm-button {
  width: 100%;
  padding: 0.75rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.confirm-button:hover {
  background: #2563eb;
}
</style>
