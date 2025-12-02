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
const hasDoubleColonToken = ref(false)
const buildRectPayload = () => {
  const el = element.value
  const selection = window.getSelection()
  const rangeRect = selection && selection.rangeCount > 0 
    ? selection.getRangeAt(0).getBoundingClientRect()
    : null

  const baseRect = el ? el.getBoundingClientRect() : null

  return {
    selectionRect: rangeRect ? {
      top: rangeRect.top,
      left: rangeRect.left,
      bottom: rangeRect.bottom,
      right: rangeRect.right
    } : null,
    targetRect: baseRect ? {
      top: baseRect.top,
      left: baseRect.left,
      bottom: baseRect.bottom,
      right: baseRect.right
    } : null
  }
}

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
  
  const text = target.innerText

  if (text.includes('/')) {
    emit('slash', e)
  }

  if (text.includes('::')) {
    if (!hasDoubleColonToken.value) {
      emit('double-colon', { ...buildRectPayload(), originalEvent: e })
      hasDoubleColonToken.value = true
    }
  } else {
    hasDoubleColonToken.value = false
  }

  nextTick(() => {
    isLocked.value = false
  })
}

const getCaretOffset = (root: HTMLElement): number | null => {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return null
  const range = selection.getRangeAt(0)
  if (!root.contains(range.startContainer)) return null

  const preRange = range.cloneRange()
  preRange.selectNodeContents(root)
  preRange.setEnd(range.startContainer, range.startOffset)
  return preRange.toString().length
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    
    const target = e.target as HTMLElement
    const cursorOffset = getCaretOffset(target)
    if (cursorOffset === null) {
      emit('enter', { afterText: '' })
      return
    }

    const fullText = target.textContent || ''
    const beforeCursor = fullText.slice(0, cursorOffset)
    const afterCursor = fullText.slice(cursorOffset)

    target.textContent = beforeCursor
    emit('update:modelValue', beforeCursor)
    emit('enter', { afterText: afterCursor })
    return
  }
  
  if (e.key === 'Backspace') {
    const target = e.target as HTMLElement
    const offset = getCaretOffset(target)
    if (offset === 0) {
      e.preventDefault()
      emit('backspace', { merge: true })
      return
    }
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
  font-family: var(--font-body, 'Inter', 'Helvetica Neue', Arial, sans-serif);
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
