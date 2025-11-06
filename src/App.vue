<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProductList from './components/ProductList.vue'
import { ProductParser } from '@/utils/productParser'
import { PromotionParser } from '@/utils/promotionParser'
import { Product } from '@/domain/Product'
import { Promotion } from '@/domain/Promotion'

const products = ref<Product[]>([])
const promotions = ref<Promotion[]>([])

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

onMounted(async () => {
  await loadData()
})
</script>

<template>
  <main>
    <h1>W 편의점</h1>
    <ProductList v-if="products.length > 0" :products="products" :promotions="promotions" />
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
</style>
