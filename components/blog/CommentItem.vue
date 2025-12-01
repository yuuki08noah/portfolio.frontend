<template>
  <div class="comment-item" :class="`depth-${comment.depth}`" :style="{ marginLeft: `${comment.depth * 30}px` }">
    <div class="comment-content">
      <div class="comment-meta">
        <span class="comment-author">{{ comment.user.name }}</span>
        <span class="comment-separator">·</span>
        <span class="comment-date">{{ formatDate(comment.created_at) }}</span>
        <span v-if="comment.updated_at !== comment.created_at" class="comment-edited">(edited)</span>
      </div>

      <!-- Display Mode -->
      <div v-if="!isEditing" class="comment-body">
        <p>{{ comment.content }}</p>
      </div>

      <!-- Edit Mode -->
      <div v-else class="comment-edit">
        <textarea v-model="editContent" class="edit-textarea" rows="3"></textarea>
        <div class="edit-actions">
          <button @click="saveEdit" class="btn-save" :disabled="saving">
            {{ saving ? 'Saving...' : 'Save' }}
          </button>
          <button @click="cancelEdit" class="btn-cancel">Cancel</button>
        </div>
      </div>

      <!-- Actions -->
      <div class="comment-actions">
        <button v-if="isAuthenticated" @click="toggleReply" class="action-btn">
          {{ showReplyForm ? 'Cancel' : 'Reply' }}
        </button>
        <button v-if="canEdit" @click="toggleEdit" class="action-btn">Edit</button>
        <button v-if="canDelete" @click="handleDelete" class="action-btn delete">Delete</button>
      </div>

      <!-- Reply Form -->
      <div v-if="showReplyForm" class="reply-form">
        <CommentForm
          :commentable-type="commentableType"
          :commentable-id="commentableId"
          :parent-id="comment.id"
          @submitted="handleReplied"
          @cancel="toggleReply"
        />
      </div>
    </div>

    <!-- Nested Replies (Recursive) -->
    <div v-if="comment.replies && comment.replies.length > 0" class="comment-replies">
      <CommentItem
        v-for="reply in comment.replies"
        :key="reply.id"
        :comment="reply"
        :commentable-type="commentableType"
        :commentable-id="commentableId"
        @replied="$emit('replied')"
        @updated="$emit('updated')"
        @deleted="$emit('deleted')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CommentForm from './CommentForm.vue'

const props = defineProps<{
  comment: any
  commentableType: string
  commentableId: number
}>()

const emit = defineEmits(['replied', 'updated', 'deleted'])

const { isAuthenticated } = useAuth()
const { $api } = useApi()

const showReplyForm = ref(false)
const isEditing = ref(false)
const editContent = ref(props.comment.content)
const saving = ref(false)

const canEdit = computed(() => props.comment.can_edit)
const canDelete = computed(() => props.comment.can_delete)

const toggleReply = () => {
  showReplyForm.value = !showReplyForm.value
  isEditing.value = false
}

const toggleEdit = () => {
  isEditing.value = !isEditing.value
  showReplyForm.value = false
  editContent.value = props.comment.content
}

const saveEdit = async () => {
  saving.value = true
  try {
    await $api(`/comments/${props.comment.id}`, {
      method: 'PUT',
      body: { content: editContent.value }
    })
    isEditing.value = false
    emit('updated')
  } catch (e) {
    alert('Failed to update comment')
  } finally {
    saving.value = false
  }
}

const cancelEdit = () => {
  isEditing.value = false
  editContent.value = props.comment.content
}

const handleDelete = async () => {
  if (!confirm('Are you sure you want to delete this comment?')) return
  
  try {
    await $api(`/comments/${props.comment.id}`, {
      method: 'DELETE'
    })
    emit('deleted')
  } catch (e) {
    alert('Failed to delete comment')
  }
}

const handleReplied = () => {
  showReplyForm.value = false
  emit('replied')
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.comment-item {
  border-left: 2px solid #e0e0e0;
  transition: border-color 0.2s ease;
}

.comment-item:hover {
  border-left-color: #999;
}

.comment-content {
  padding: 20px 0 20px 20px;
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
}

.comment-author {
  font-weight: 600;
  color: #111;
}

.comment-separator {
  color: #ccc;
}

.comment-date {
  color: #999;
}

.comment-edited {
  color: #999;
  font-style: italic;
}

.comment-body {
  margin-bottom: 12px;
}

.comment-body p {
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #333;
  margin: 0;
}

.comment-edit {
  margin-bottom: 12px;
}

.edit-textarea {
  width: 100%;
  padding: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  resize: vertical;
  min-height: 80px;
}

.edit-textarea:focus {
  outline: none;
  border-color: #111;
}

.edit-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.btn-save,
.btn-cancel {
  padding: 6px 16px;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid #111;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-save {
  background: #111;
  color: #fff;
}

.btn-save:hover {
  background: #333;
}

.btn-save:disabled {
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

.comment-actions {
  display: flex;
  gap: 16px;
}

.action-btn {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: #666;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  transition: color 0.2s;
}

.action-btn:hover {
  color: #111;
}

.action-btn.delete:hover {
  color: #c00;
}

.reply-form {
  margin-top: 20px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 4px;
}

.comment-replies {
  margin-top: 0;
}
</style>
