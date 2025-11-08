<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProductList from './components/ProductList.vue'
import BaseModal from './components/BaseModal.vue'
import { ProductParser } from '@/utils/productParser'
import { PromotionParser } from '@/utils/promotionParser'
import { Product } from '@/domain/Product'
import { Promotion } from '@/domain/Promotion'

const products = ref<Product[]>([])
const promotions = ref<Promotion[]>([])
const isModalOpen = ref(false)

async function loadData() {
  const productsResponse = await fetch('/data/products.md')
  const productsText = await productsResponse.text()
  const productParser = new ProductParser()
  products.value = productParser.parse(productsText)

  const promotionsResponse = await fetch('/data/promotions.md')
  const promotionsText = await promotionsResponse.text()
  const promotionParser = new PromotionParser()
  promotions.value = promotionParser.parse(promotionsText)
}

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const confirmAction = () => {
  alert('확인 버튼 클릭!')
  closeModal()
}

onMounted(async () => {
  await loadData()
})
</script>

<template>
  <main>
    <h1>W 편의점</h1>

    <div class="test-section">
      <button @click="openModal" class="test-button">모달 테스트</button>
    </div>

    <ProductList v-if="products.length > 0" :products="products" :promotions="promotions" />

    <BaseModal
      :is-open="isModalOpen"
      title="프로모션 안내"
      @close="closeModal"
    >
      <p>현재 1+1 프로모션이 적용 가능한 상품입니다.</p>
      <p>프로모션 재고를 추가로 가져오시겠습니까?</p>

      <template #footer>
        <button @click="closeModal" class="button-secondary">취소</button>
        <button @click="confirmAction" class="button-primary">확인</button>
      </template>
    </BaseModal>
  </main>
</template>

<style scoped>
main {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 2rem 0;
}

h1 {
  text-align: center;
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.test-section {
  max-width: 1200px;
  margin: 0 auto 2rem;
  padding: 0 1rem;
  text-align: center;
}

.test-button {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.test-button:hover {
  background: #2563eb;
}

.button-primary {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.button-primary:hover {
  background: #2563eb;
}

.button-secondary {
  padding: 0.5rem 1rem;
  background: #e5e7eb;
  color: #374151;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.button-secondary:hover {
  background: #d1d5db;
}
</style>
