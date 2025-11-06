<script setup lang="ts">
import { computed, type PropType } from 'vue'
import PromotionBadge from './PromotionBadge.vue'
import { Product } from '@/domain/Product'

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

const isOutOfStock = computed(() => props.product.quantity === 0)

const formatPrice = (price: number): string => {
  return price.toLocaleString('ko-KR')
}

const getStockText = (quantity: number): string => {
  if (quantity === 0) {
    return '재고 없음'
  }
  return `${quantity}개`
}
</script>

<template>
  <tr :class="{ 'out-of-stock': isOutOfStock }">
    <td class="product-name">{{ product.name }}</td>
    <td class="product-price">{{ formatPrice(product.price) }}원</td>
    <td class="product-quantity">{{ getStockText(product.quantity) }}</td>
    <td class="product-promotion">
      <PromotionBadge
        :promotion-name="product.promotion"
        :is-active="isPromotionActive"
      />
    </td>
  </tr>
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
</style>
