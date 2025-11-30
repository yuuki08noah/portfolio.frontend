<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="visible" class="toast-container">
        <div class="toast">
          <span class="toast-icon">!</span>
          <span class="toast-message">{{ message }}</span>
          <button class="toast-close" @click="close">×</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  show: boolean
  message: string
  type?: 'error' | 'success' | 'warning' | 'info'
  duration?: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const visible = ref(props.show)

watch(() => props.show, (newVal) => {
  visible.value = newVal
  if (newVal && props.duration !== 0) {
    setTimeout(() => {
      close()
    }, props.duration || 4000)
  }
})

const close = () => {
  visible.value = false
  emit('close')
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  margin-top: -200px;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 15px;
  font-weight: 500;
  min-width: 320px;
  max-width: 480px;
  border: 1px solid #e2e8f0;
}

.toast-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
  background: #f1f5f9;
  color: #64748b;
}

.toast-message {
  flex: 1;
  color: #334155;
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  font-size: 20px;
  color: #94a3b8;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.2s;
}

.toast-close:hover {
  color: #475569;
}

.toast-enter-active {
  animation: fadeIn 0.25s ease-out;
}

.toast-leave-active {
  animation: fadeOut 0.2s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}
</style>
