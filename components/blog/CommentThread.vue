<template>
  <div class="comment-section">
    <div class="comment-header">
      <h3 class="comment-title">Comments ({{ totalComments }})</h3>
    </div>

    <!-- New Comment Form (Root level) -->
    <div v-if="isAuthenticated" class="new-comment">
      <CommentForm 
        :commentable-type="commentableType"
        :commentable-id="commentableId"
        @submitted="handleCommentSubmitted"
      />
    </div>
    <div v-else class="login-prompt">
      <p>Please <NuxtLink to="/auth/signin">sign in</NuxtLink> to leave a comment.</p>
    </div>

    <!-- Comments List -->
    <div v-if="loading" class="loading">Loading comments...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="comments.length === 0" class="no-comments">
      No comments yet. Be the first to comment!
    </div>
    <div v-else class="comments-list">
      <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        :commentable-type="commentableType"
        :commentable-id="commentableId"
        @replied="handleCommentSubmitted"
        @updated="loadComments"
        @deleted="loadComments"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CommentItem from './CommentItem.vue'
import CommentForm from './CommentForm.vue'

const props = defineProps<{
  commentableType: string
  commentableId: number
}>()

const { isAuthenticated } = useAuth()
const { locale } = useI18n()
const { $api } = useApi()

const comments = ref<any[]>([])
const totalComments = ref(0)
const loading = ref(false)
const error = ref('')

const loadComments = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await $api<any>(`/comments?commentable_type=${props.commentableType}&commentable_id=${props.commentableId}&locale=${locale.value}`, {
      auth: false
    })
    
    comments.value = response.comments || response
    totalComments.value = response.total || (Array.isArray(response) ? response.length : 0)
  } catch (e: any) {
    error.value = e.message || 'Failed to load comments'
  } finally {
    loading.value = false
  }
}

const handleCommentSubmitted = () => {
  loadComments()
}

onMounted(() => {
  loadComments()
})
</script>

<style scoped>
.comment-section {
  margin-top: 0;
  padding-top: 0;
  border-top: none;
}

.comment-header {
  margin-bottom: 30px;
}

.comment-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
  color: #111;
}

.new-comment {
  margin-bottom: 40px;
}

.login-prompt {
  padding: 20px;
  background: #f5f5f5;
  border-left: 3px solid #666;
  margin-bottom: 40px;
}

.login-prompt p {
  margin: 0;
  font-family: 'Inter', sans-serif;
  color: #666;
}

.login-prompt a {
  color: #111;
  font-weight: 600;
  text-decoration: underline;
}

.loading,
.error,
.no-comments {
  padding: 40px 20px;
  text-align: center;
  font-family: 'Inter', sans-serif;
  color: #666;
}

.error {
  color: #c00;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}
</style>
