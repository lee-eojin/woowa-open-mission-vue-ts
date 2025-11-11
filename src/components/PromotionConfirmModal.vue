<script setup lang="ts">
import BaseModal from './BaseModal.vue'

interface Props {
  isOpen: boolean
  type: 'additional-free' | 'full-price'
  productName: string
  quantity: number
}

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const getMessage = (): string => {
  if (props.type === 'additional-free') {
    return `현재 ${props.productName}은(는) ${props.quantity}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까?`
  } else {
    return `현재 ${props.productName} ${props.quantity}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까?`
  }
}

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <BaseModal
    :isOpen="isOpen"
    title="프로모션 안내"
    :closeOnBackdrop="false"
    :closeOnEsc="false"
    @close="handleCancel"
  >
    <div class="modal-message">
      <p>{{ getMessage() }}</p>
    </div>

    <template #footer>
      <button @click="handleCancel" class="button button-secondary">
        아니오
      </button>
      <button @click="handleConfirm" class="button button-primary">
        예
      </button>
    </template>
  </BaseModal>
</template>

<style scoped>
.modal-message {
  padding: 1rem 0;
  line-height: 1.6;
}

.modal-message p {
  margin: 0;
  font-size: 1rem;
  color: #374151;
}

.button {
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.button-primary {
  background: #3b82f6;
  color: white;
}

.button-primary:hover {
  background: #2563eb;
}

.button-secondary {
  background: #e5e7eb;
  color: #374151;
}

.button-secondary:hover {
  background: #d1d5db;
}
</style>
