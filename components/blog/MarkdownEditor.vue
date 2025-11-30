<template>
  <div class="markdown-editor">
    <div class="editor-toolbar">
      <button @click="insertBold">B</button>
      <button @click="insertItalic">I</button>
      <button @click="insertLink">Link</button>
      <button @click="insertImage">Image</button>
    </div>
    
    <div class="editor-container">
      <textarea
        v-model="content"
        class="editor"
        placeholder="Write your post in Markdown..."
        @input="handleInput"
      />
      
      <div class="preview">
        <MarkdownRenderer :content="content" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const content = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  content.value = newVal
})

const handleInput = () => {
  emit('update:modelValue', content.value)
}

const insertBold = () => {
  content.value += '**bold text**'
  handleInput()
}

const insertItalic = () => {
  content.value += '*italic text*'
  handleInput()
}

const insertLink = () => {
  content.value += '[link text](url)'
  handleInput()
}

const insertImage = () => {
  content.value += '![alt text](image-url)'
  handleInput()
}
</script>
