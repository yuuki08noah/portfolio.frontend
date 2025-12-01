<template>
  <div 
    class="editor-block-wrapper"
    :class="{ 
      'is-dragging': isDragging,
      'drop-top': dropPosition === 'top',
      'drop-bottom': dropPosition === 'bottom',
      'drop-left': dropPosition === 'left',
      'drop-right': dropPosition === 'right'
    }"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop.stop="onDrop"
  >
    <div class="block-handle" contenteditable="false">
      <div class="handle-icon">⋮⋮</div>
    </div>
    <div class="block-content-area">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  blockId: string
  index: number
  parentId?: string
}>()

const emit = defineEmits(['reorder', 'create-column', 'drag-start', 'drag-end'])

const isDragging = ref(false)
const dropPosition = ref<'top' | 'bottom' | 'left' | 'right' | null>(null)

const onDragStart = (e: DragEvent) => {
  isDragging.value = true
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('application/json', JSON.stringify({
      id: props.blockId,
      index: props.index,
      parentId: props.parentId
    }))
  }
  emit('drag-start', props.blockId)
}

const onDragEnd = () => {
  isDragging.value = false
  dropPosition.value = null
  emit('drag-end')
}

const onDragOver = (e: DragEvent) => {
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  const width = rect.width
  const height = rect.height
  
  if (x < width * 0.2) {
    dropPosition.value = 'left'
  } else if (x > width * 0.8) {
    dropPosition.value = 'right'
  } else if (y < height * 0.5) {
    dropPosition.value = 'top'
  } else {
    dropPosition.value = 'bottom'
  }
}

const onDragLeave = () => {
  dropPosition.value = null
}

const onDrop = (e: DragEvent) => {
  if (!e.dataTransfer) return
  
  const data = e.dataTransfer.getData('application/json')
  if (!data) return
  
  const draggedBlock = JSON.parse(data)
  
  if (draggedBlock.id === props.blockId) return

  emit('reorder', {
    draggedId: draggedBlock.id,
    targetId: props.blockId,
    position: dropPosition.value
  })
  
  dropPosition.value = null
}
</script>

<style scoped>
.editor-block-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 4px 0;
  position: relative;
  transition: all 0.2s;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
}

.editor-block-wrapper:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.editor-block-wrapper:hover .block-handle {
  opacity: 1;
}

.editor-block-wrapper.is-dragging {
  opacity: 0.4;
  background: #f5f5f5;
}

.editor-block-wrapper::after {
  content: '';
  position: absolute;
  pointer-events: none;
  background: #2196f3;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 10;
}

.drop-top::after {
  top: -2px;
  left: 0;
  right: 0;
  height: 4px;
  opacity: 1;
}

.drop-bottom::after {
  bottom: -2px;
  left: 0;
  right: 0;
  height: 4px;
  opacity: 1;
}

.drop-left::after {
  top: 0;
  bottom: 0;
  left: -2px;
  width: 4px;
  opacity: 1;
}

.drop-right::after {
  top: 0;
  bottom: 0;
  right: -2px;
  width: 4px;
  opacity: 1;
}

.block-handle {
  opacity: 0.3;
  cursor: grab;
  padding: 4px 2px;
  border-radius: 4px;
  color: #9ca3af;
  transition: all 0.2s;
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: 2px;
}

.block-handle:hover {
  background: #e5e7eb;
  color: #374151;
  opacity: 1;
}

.handle-icon {
  font-size: 14px;
  line-height: 1;
  letter-spacing: -2px;
}

.block-content-area {
  flex: 1;
  min-width: 0;
  width: 100%;
}
</style>
