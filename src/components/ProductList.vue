<script setup lang="ts">
import { computed, type PropType } from 'vue'
import ProductTableRow from './ProductTableRow.vue'
import { Product } from '@/domain/Product'
import { Promotion } from '@/domain/Promotion'

const props = defineProps({
  products: {
    type: Array as PropType<Product[]>,
    required: true
  },
  promotions: {
    type: Array as PropType<Promotion[]>,
    required: true
  }
})

const activePromotionNames = computed(() => {
  return new Set(
    props.promotions
      .filter(p => p.isActive())
      .map(p => p.name)
  )
})

const isPromotionActive = (product: Product): boolean => {
  if (!product.hasPromotion()) {
    return false
  }
  return activePromotionNames.value.has(product.promotion!)
}
</script>

<template>
  <div class="product-list">
    <h2>현재 보유하고 있는 상품입니다.</h2>

    <table class="product-table">
      <thead>
        <tr>
          <th>상품명</th>
          <th>가격</th>
          <th>재고</th>
          <th>프로모션</th>
        </tr>
      </thead>
      <tbody>
        <ProductTableRow
          v-for="(product, index) in products"
          :key="index"
          :product="product"
          :is-promotion-active="isPromotionActive(product)"
        />
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.product-list {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

thead {
  background: #42b883;
  color: white;
}

th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.95rem;
}
</style>
