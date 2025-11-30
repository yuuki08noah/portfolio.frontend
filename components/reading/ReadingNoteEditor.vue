<template>
  <div class="reading-note-editor">
    <h3>Reading Notes</h3>
    
    <MarkdownEditor v-model="content" />
    
    <div class="quotes-section">
      <h4>Favorite Quotes</h4>
      <div v-for="(quote, index) in quotes" :key="index" class="quote-item">
        <textarea v-model="quotes[index]" placeholder="Enter a quote..." />
        <button @click="removeQuote(index)">Remove</button>
      </div>
      <button @click="addQuote" class="add-quote-btn">+ Add Quote</button>
    </div>
    
    <div class="tags-section">
      <h4>Tags</h4>
      <input
        v-model="tagInput"
        type="text"
        placeholder="Add tags..."
        @keyup.enter="addTag"
      />
      <div class="tags">
        <span v-for="tag in tags" :key="tag" class="tag">
          {{ tag }}
          <button @click="removeTag(tag)">×</button>
        </span>
      </div>
    </div>
    
    <button @click="handleSave" class="save-btn">Save Notes</button>
  </div>
</template>

<script setup lang="ts">
import type { ReadingNote } from '~/types'

const props = defineProps<{
  initialNote?: ReadingNote
}>()

const emit = defineEmits<{
  save: [note: Partial<ReadingNote>]
}>()

const content = ref(props.initialNote?.content || '')
const quotes = ref<string[]>(props.initialNote?.quotes || [])
const tags = ref<string[]>(props.initialNote?.tags || [])
const tagInput = ref('')

const addQuote = () => {
  quotes.value.push('')
}

const removeQuote = (index: number) => {
  quotes.value.splice(index, 1)
}

const addTag = () => {
  if (tagInput.value.trim()) {
    tags.value.push(tagInput.value.trim())
    tagInput.value = ''
  }
}

const removeTag = (tag: string) => {
  tags.value = tags.value.filter(t => t !== tag)
}

const handleSave = () => {
  emit('save', {
    content: content.value,
    quotes: quotes.value.filter(q => q.trim()),
    tags: tags.value
  })
}
</script>
