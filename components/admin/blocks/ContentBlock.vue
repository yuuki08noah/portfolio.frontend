<template>
  <div
    ref="element"
    class="content-block-input"
    contenteditable="true"
    @input="onInput"
    @keydown="onKeydown"
    @paste="onPaste"
    @focus="onFocus"
    @blur="onBlur"
  ></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'

const props = defineProps<{
  modelValue: string
  tagName?: string
  placeholder?: string
}>()

const emit = defineEmits(['update:modelValue', 'enter', 'backspace', 'arrow-up', 'arrow-down', 'slash', 'double-colon'])

const element = ref<HTMLElement | null>(null)
const isLocked = ref(false)

onMounted(() => {
  if (element.value) {
    element.value.innerText = props.modelValue
  }
})

watch(() => props.modelValue, (newValue) => {
  if (isLocked.value) return
  if (element.value && element.value.innerText !== newValue) {
    element.value.innerText = newValue
  }
})

const onInput = (e: Event) => {
  const target = e.target as HTMLElement
  isLocked.value = true
  emit('update:modelValue', target.innerText)
  
  if (typeof window !== 'undefined') {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const text = target.innerText
      if (text.endsWith('::')) {
        emit('double-colon', e)
      } else if (text.includes('/')) {
        emit('slash', e)
      }
    }
  }

  nextTick(() => {
    isLocked.value = false
  })
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    emit('enter', e)
    return
  }
  
  if (e.key === 'Backspace') {
    const target = e.target as HTMLElement
    if (!target.innerText.trim()) {
      e.preventDefault()
      emit('backspace', e)
    }
    return
  }
  
  if (e.key === 'ArrowUp') {
    emit('arrow-up', e)
  } else if (e.key === 'ArrowDown') {
    emit('arrow-down', e)
  }
}

const onPaste = (e: ClipboardEvent) => {
  e.preventDefault()
  const text = e.clipboardData?.getData('text/plain') || ''
  if (typeof document !== 'undefined') {
    document.execCommand('insertText', false, text)
  }
}

const onFocus = () => {
  // Optional: emit focus event
}

const onBlur = () => {
  isLocked.value = false
}
</script>

<style scoped>
.content-block-input {
  outline: none;
  min-height: 1.5em;
  white-space: pre-wrap;
  word-break: break-word;
  padding: 3px 2px;
  border-radius: 3px;
  transition: background-color 0.15s ease;
  width: 100%;
  box-sizing: border-box;
}

.content-block-input:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.content-block-input:focus {
  background-color: transparent;
}

.content-block-input:empty::before {
  content: attr(placeholder);
  color: #9ca3af;
  pointer-events: none;
}
</style>
