<script setup lang="ts">
interface Props {
  promotionName: string | null
  isActive: boolean
}

defineProps<Props>()
</script>

<template>
  <span v-if="promotionName && isActive" class="promotion-badge">
    {{ promotionName }}
  </span>
  <span v-else class="no-promotion">-</span>
</template>

<style scoped>
.promotion-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #ffeaa7;
  color: #d63031;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.no-promotion {
  color: #ccc;
}
</style>
