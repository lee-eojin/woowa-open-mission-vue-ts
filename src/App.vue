<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProductList from './components/ProductList.vue'
import CartSummary from './components/CartSummary.vue'
import { ProductParser } from '@/utils/productParser'
import { PromotionParser } from '@/utils/promotionParser'
import { Product } from '@/domain/Product'
import { Promotion } from '@/domain/Promotion'
import { useCartStore } from '@/stores/cartStore'
import { UI_MESSAGES } from '@/constants/uiMessages'
import { CONSTANTS } from '@/constants/constants'

const products = ref<Product[]>([])
const promotions = ref<Promotion[]>([])
const cartStore = useCartStore()

async function loadData() {
  const productsResponse = await fetch(CONSTANTS.CONFIG.DATA_PATH.PRODUCTS_FILE)
  const productsText = await productsResponse.text()
  const productParser = new ProductParser()
  products.value = productParser.parse(productsText)

  const promotionsResponse = await fetch(CONSTANTS.CONFIG.DATA_PATH.PROMOTIONS_FILE)
  const promotionsText = await promotionsResponse.text()
  const promotionParser = new PromotionParser()
  promotions.value = promotionParser.parse(promotionsText)

  cartStore.initialize(products.value, promotions.value)
}

onMounted(async () => {
  await loadData()
})
</script>

<template>
  <main>
    <h1>{{ UI_MESSAGES.APP.STORE_NAME }}</h1>

    <div class="container">
      <ProductList v-if="products.length > 0" :products="products" :promotions="promotions" />
      <CartSummary />
    </div>
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

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 1024px) {
  .container {
    grid-template-columns: 1fr;
  }
}
</style>
