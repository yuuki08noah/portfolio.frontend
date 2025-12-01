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
  
  const selection = window.getSelection()
  if (selection && selection.rangeCount > 0) {
    const text = target.innerText
    if (text.includes('/')) {
      emit('slash', e)
    }
    if (text.includes('::')) {
      emit('double-colon', e)
    }
  }

  nextTick(() => {
    isLocked.value = false
  })
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    
    const target = e.target as HTMLElement
    const selection = window.getSelection()
    
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const cursorOffset = range.startOffset
      
      // Get the text content
      const fullText = target.innerText
      
      // Split at cursor position
      const beforeCursor = fullText.substring(0, cursorOffset)
      const afterCursor = fullText.substring(cursorOffset)
      
      // Update current block with text before cursor
      target.innerText = beforeCursor
      emit('update:modelValue', beforeCursor)
      
      // Emit enter with the text that should go to the new block
      emit('enter', { afterText: afterCursor })
    } else {
      emit('enter', { afterText: '' })
    }
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

const onPaste = async (e: ClipboardEvent) => {
  e.preventDefault()
  
  // Handle files
  if (e.clipboardData?.files.length) {
    const file = e.clipboardData.files[0]
    if (file && file.type.startsWith('image/')) {
      // Insert placeholder
      document.execCommand('insertText', false, '![Uploading...]()')
      
      const { uploadImage } = useUpload()
      const url = await uploadImage(file)
      
      if (url && element.value) {
        // Replace placeholder with actual image markdown
        // Note: This is a simple replacement, might need robust selection handling if user moved cursor
        const text = element.value.innerText
        const newText = text.replace('![Uploading...]()', `![Image](${url})`)
        element.value.innerText = newText
        emit('update:modelValue', newText)
      } else {
        // Handle error (remove placeholder)
        const text = element.value?.innerText || ''
        const newText = text.replace('![Uploading...]()', '[Upload Failed]')
        if (element.value) {
          element.value.innerText = newText
          emit('update:modelValue', newText)
        }
      }
      return
    }
  }

  // Handle text
  const text = e.clipboardData?.getData('text/plain') || ''
  document.execCommand('insertText', false, text)
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
