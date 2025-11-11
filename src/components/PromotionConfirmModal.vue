<script setup lang="ts">
import BaseModal from './BaseModal.vue'
import { UI_MESSAGES } from '@/constants/uiMessages'

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
    return UI_MESSAGES.PROMOTION_MODAL.ADDITIONAL_FREE_OFFER_MESSAGE(props.productName, props.quantity)
  } else {
    return UI_MESSAGES.PROMOTION_MODAL.FULL_PRICE_WARNING_MESSAGE(props.productName, props.quantity)
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
    :title="UI_MESSAGES.PROMOTION_MODAL.MODAL_TITLE"
    :closeOnBackdrop="false"
    :closeOnEsc="false"
    @close="handleCancel"
  >
    <div class="modal-message">
      <p>{{ getMessage() }}</p>
    </div>

    <template #footer>
      <button @click="handleCancel" class="button button-secondary">
        {{ UI_MESSAGES.COMMON.CANCEL_TEXT }}
      </button>
      <button @click="handleConfirm" class="button button-primary">
        {{ UI_MESSAGES.COMMON.CONFIRM_TEXT }}
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
