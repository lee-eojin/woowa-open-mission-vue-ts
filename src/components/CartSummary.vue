<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore'

const cartStore = useCartStore()

const formatPrice = (price: number): string => {
  return price.toLocaleString('ko-KR')
}

const removeItem = (productName: string) => {
  if (confirm(`${productName}을(를) 장바구니에서 제거하시겠습니까?`)) {
    cartStore.removeItem(productName)
  }
}
</script>

<template>
  <div class="cart-summary">
    <h2>장바구니</h2>

    <div v-if="cartStore.isEmpty" class="empty-cart">
      <p>장바구니가 비어있습니다.</p>
    </div>

    <div v-else class="cart-content">
      <div class="cart-items">
        <div v-for="item in cartStore.items" :key="item.product.name" class="cart-item">
          <div class="item-info">
            <span class="item-name">{{ item.product.name }}</span>
            <span class="item-quantity">{{ item.quantity }}개</span>
          </div>
          <div class="item-actions">
            <span class="item-price">{{ formatPrice(item.getTotalPrice()) }}원</span>
            <button @click="removeItem(item.product.name)" class="remove-button">삭제</button>
          </div>
        </div>
      </div>

      <div class="cart-summary-info">
        <div class="summary-row">
          <span>총 금액</span>
          <span class="summary-value">{{ formatPrice(cartStore.totalPrice) }}원</span>
        </div>
        <div v-if="cartStore.promotionDiscount > 0" class="summary-row discount">
          <span>프로모션 할인</span>
          <span class="summary-value">-{{ formatPrice(cartStore.promotionDiscount) }}원</span>
        </div>
        <div class="summary-row final">
          <span>최종 금액</span>
          <span class="summary-value">{{ formatPrice(cartStore.finalPrice) }}원</span>
        </div>
      </div>

      <button class="checkout-button">결제하기</button>
    </div>
  </div>
</template>

<style scoped>
.cart-summary {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  max-width: 400px;
  margin: 0 auto;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #2c3e50;
  border-bottom: 2px solid #42b883;
  padding-bottom: 0.5rem;
}

.empty-cart {
  text-align: center;
  padding: 2rem;
  color: #999;
}

.cart-items {
  margin-bottom: 1.5rem;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.item-name {
  font-weight: 500;
  color: #2c3e50;
}

.item-quantity {
  font-size: 0.9rem;
  color: #666;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.item-price {
  font-weight: 600;
  color: #e74c3c;
}

.remove-button {
  padding: 0.4rem 0.8rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.2s;
}

.remove-button:hover {
  background: #dc2626;
}

.cart-summary-info {
  border-top: 2px solid #eee;
  padding-top: 1rem;
  margin-bottom: 1rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 0.95rem;
}

.summary-row.discount {
  color: #10b981;
}

.summary-row.final {
  font-weight: 700;
  font-size: 1.1rem;
  color: #2c3e50;
  border-top: 1px solid #ddd;
  margin-top: 0.5rem;
  padding-top: 1rem;
}

.summary-value {
  font-weight: 600;
}

.checkout-button {
  width: 100%;
  padding: 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.checkout-button:hover {
  background: #2563eb;
}
</style>
