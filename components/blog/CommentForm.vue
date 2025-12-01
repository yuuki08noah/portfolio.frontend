<template>
  <form @submit.prevent="handleSubmit" class="comment-form">
    <textarea
      v-model="content"
      :placeholder="placeholder"
      class="comment-input"
      rows="4"
      required
    ></textarea>
    
    <div class="form-actions">
      <button type="submit" class="btn-submit" :disabled="submitting || !content.trim()">
        {{ submitting ? 'Posting...' : submitLabel }}
      </button>
      <button v-if="showCancel" type="button" class="btn-cancel" @click="handleCancel">
        Cancel
      </button>
    </div>

    <div v-if="error" class="error-message">{{ error }}</div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  commentableType: string
  commentableId: number
  parentId?: number
  initialContent?: string
  placeholder?: string
  submitLabel?: string
  showCancel?: boolean
}>()

const emit = defineEmits(['submitted', 'cancel'])

const { locale } = useI18n()

const content = ref(props.initialContent || '')
const submitting = ref(false)
const error = ref('')

const handleSubmit = async () => {
  if (!content.value.trim()) return
  
  submitting.value = true
  error.value = ''
  
  try {
    await $fetch('/api/v1/comments', {
      method: 'POST',
      body: {
        comment: {
          content: content.value,
          parent_id: props.parentId,
          locale: locale.value
        },
        commentable_type: props.commentableType,
        commentable_id: props.commentableId
      }
    })
    
    content.value = ''
    emit('submitted')
  } catch (e: any) {
    error.value = e.data?.errors?.join(', ') || e.message || 'Failed to post comment'
  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  content.value = ''
  emit('cancel')
}
</script>

<style scoped>
.comment-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comment-input {
  width: 100%;
  padding: 12px 16px;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  line-height: 1.6;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s;
}

.comment-input:focus {
  outline: none;
  border-color: #111;
}

.comment-input::placeholder {
  color: #999;
}

.form-actions {
  display: flex;
  gap: 10px;
}

.btn-submit,
.btn-cancel {
  padding: 10px 20px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  border: 1px solid #111;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-submit {
  background: #111;
  color: #fff;
}

.btn-submit:hover:not(:disabled) {
  background: #333;
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-cancel {
  background: #fff;
  color: #111;
}

.btn-cancel:hover {
  background: #f5f5f5;
}

.error-message {
  padding: 12px;
  background: #ffebee;
  border: 1px solid #ef9a9a;
  color: #c62828;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  border-radius: 4px;
}
</style>
