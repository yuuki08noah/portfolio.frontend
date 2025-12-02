<template>
  <div class="markdown-editor-container">
    <!-- View Mode Toggle -->
    <div class="view-toggle">
      <button 
        :class="['toggle-btn', { active: viewMode === 'editor' }]" 
        @click="viewMode = 'editor'"
      >
        Editor
      </button>
      <button 
        :class="['toggle-btn', { active: viewMode === 'split' }]" 
        @click="viewMode = 'split'"
      >
        Split
      </button>
      <button 
        :class="['toggle-btn', { active: viewMode === 'preview' }]" 
        @click="viewMode = 'preview'"
      >
        Preview
      </button>
    </div>

    <div class="editor-main" :class="viewMode">
      <!-- Editor Panel -->
      <div v-show="viewMode !== 'preview'" class="editor-panel">
        <div class="editor-toolbar">
          <!-- Text formatting group -->
          <div class="toolbar-group">
            <button type="button" class="toolbar-btn" title="Bold" @click="wrapSelection('**')"><strong>B</strong></button>
            <button type="button" class="toolbar-btn toolbar-italic" title="Italic" @click="wrapSelection('*')">I</button>
            <button type="button" class="toolbar-btn toolbar-strikethrough" title="Strikethrough" @click="wrapSelection('~~')">S</button>
            <button type="button" class="toolbar-btn toolbar-code" title="Inline Code" @click="wrapSelection('`')">&lt;/&gt;</button>
          </div>
          
          <span class="toolbar-divider"></span>
          
          <!-- Headings group -->
          <div class="toolbar-group">
            <button type="button" class="toolbar-btn" title="Heading 1" @click="addBlock('heading-1')">H1</button>
            <button type="button" class="toolbar-btn" title="Heading 2" @click="addBlock('heading-2')">H2</button>
            <button type="button" class="toolbar-btn" title="Heading 3" @click="addBlock('heading-3')">H3</button>
          </div>
          
          <span class="toolbar-divider"></span>
          
          <!-- Lists group -->
          <div class="toolbar-group">
            <button type="button" class="toolbar-btn" title="Bulleted List" @click="addBlock('bulleted-list')">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="2" cy="4" r="1.5"/>
                <circle cx="2" cy="8" r="1.5"/>
                <circle cx="2" cy="12" r="1.5"/>
                <rect x="5" y="3" width="10" height="2" rx="0.5"/>
                <rect x="5" y="7" width="10" height="2" rx="0.5"/>
                <rect x="5" y="11" width="10" height="2" rx="0.5"/>
              </svg>
            </button>
            <button type="button" class="toolbar-btn" title="Numbered List" @click="addBlock('numbered-list')">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <text x="1" y="5" font-size="5" font-weight="600">1</text>
                <text x="1" y="9" font-size="5" font-weight="600">2</text>
                <text x="1" y="13" font-size="5" font-weight="600">3</text>
                <rect x="5" y="3" width="10" height="2" rx="0.5"/>
                <rect x="5" y="7" width="10" height="2" rx="0.5"/>
                <rect x="5" y="11" width="10" height="2" rx="0.5"/>
              </svg>
            </button>
            <button type="button" class="toolbar-btn" title="To-do" @click="addBlock('todo')">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="2" y="2" width="12" height="12" rx="2"/>
                <path d="M5 8L7 10L11 6"/>
              </svg>
            </button>
          </div>
          
          <span class="toolbar-divider"></span>
          
          <!-- Block elements group -->
          <div class="toolbar-group">
            <button type="button" class="toolbar-btn" title="Quote" @click="addBlock('quote')">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M3 3h4v4H5v2c0 1 1 2 2 2v2c-2.5 0-4-1.5-4-4V3zm7 0h4v4h-2v2c0 1 1 2 2 2v2c-2.5 0-4-1.5-4-4V3z"/>
              </svg>
            </button>
            <button type="button" class="toolbar-btn" title="Code Block" @click="addBlock('code')">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M5 4L1 8l4 4M11 4l4 4-4 4"/>
              </svg>
            </button>
            <button type="button" class="toolbar-btn" title="Callout" @click="addBlock('callout')">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a7 7 0 100 14A7 7 0 008 1zM7 5h2v1H7V5zm0 2h2v4H7V7z"/>
              </svg>
            </button>
            <button type="button" class="toolbar-btn" title="Divider" @click="addBlock('divider')">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="7" width="14" height="2" rx="1"/>
              </svg>
            </button>
          </div>
          
          <span class="toolbar-divider"></span>
          
          <!-- Media group -->
          <div class="toolbar-group">
            <button type="button" class="toolbar-btn" title="Image" @click="addBlock('image')">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="2" y="2" width="12" height="12" rx="2"/>
                <circle cx="5.5" cy="5.5" r="1.5" fill="currentColor"/>
                <path d="M2 11l3-3 2 2 4-4 3 3"/>
              </svg>
            </button>
            <button type="button" class="toolbar-btn" title="Link" @click="insertLink">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M6.5 9.5a3 3 0 004.2.2l2-2a3 3 0 00-4.2-4.2l-1.1 1M9.5 6.5a3 3 0 00-4.2-.2l-2 2a3 3 0 004.2 4.2l1.1-1"/>
              </svg>
            </button>
            <button type="button" class="toolbar-btn" title="Table" @click="addBlock('table')">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="2" y="2" width="12" height="12" rx="1"/>
                <line x1="2" y1="6" x2="14" y2="6"/>
                <line x1="2" y1="10" x2="14" y2="10"/>
                <line x1="6" y1="2" x2="6" y2="14"/>
                <line x1="10" y1="2" x2="10" y2="14"/>
              </svg>
            </button>
          </div>
          
          <span class="toolbar-divider"></span>
          
          <!-- Add block -->
          <button type="button" class="toolbar-btn toolbar-add" title="Add Block" @click="addBlock('paragraph')">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="8" y1="3" x2="8" y2="13"/>
              <line x1="3" y1="8" x2="13" y2="8"/>
            </svg>
          </button>
        </div>

        <div 
          class="editor-wrapper" 
          ref="editorWrapper" 
          @click="handleEditorClick"
          @dragover="handleDragOver"
          @drop="handleDrop"
        >
          <div class="blocks-list" ref="blocksList">
        <template v-for="(block, index) in blocks" :key="block.id">
          
          <!-- Row Block -->
          <div v-if="block.type === 'row'" class="block-row">
            <template v-for="(col, colIndex) in block.children" :key="col.id">
              <div 
                class="block-column"
                :style="{ flex: col.width ? `0 0 ${col.width}%` : '1' }"
              >
                <!-- Column Content -->
                <div class="column-content">
                  <EditorBlock
                    v-for="(childBlock, childIndex) in col.children"
                    :key="childBlock.id"
                    :blockId="childBlock.id"
                    :index="childIndex"
                    :parentId="col.id"
                    :selected="isSelected(childBlock.id)"
                    :selectedIds="selectedBlockIds"
                    @reorder="handleReorder"
                    @open-settings="handleDoubleColon($event, childBlock.id)"
                    @toggle-select="toggleSelect(childBlock.id, $event)"
                    @drag-hover="handleDragHover"
                  >
                    <ContentBlock
                      v-model="childBlock.content"
                      :class="childBlock.type"
                      :placeholder="getPlaceholder(childBlock.type)"
                      @enter="(e) => handleEnter(e, childBlock.id, col.id)"
                      @backspace="(e) => handleBackspace(childBlock.id, col.id, e)"
                      @slash="handleSlash($event, childBlock.id)"
                      @double-colon="handleDoubleColon($event, childBlock.id)"
                    />
                  </EditorBlock>
                </div>

              </div>
              
              <!-- Resize Handle -->
              <div 
                v-if="colIndex < (block.children?.length || 0) - 1"
                class="column-resize-handle"
                @mousedown.prevent="startColumnResize($event, block, colIndex)"
              ></div>
            </template>
          </div>

          <!-- Standard Block -->
          <EditorBlock
            v-else
            :blockId="block.id"
            :index="index"
            :selected="isSelected(block.id)"
            :selectedIds="selectedBlockIds"
            @reorder="handleReorder"
            @open-settings="handleDoubleColon($event, block.id)"
            @toggle-select="toggleSelect(block.id, $event)"
            @drag-hover="handleDragHover"
          >
            <!-- TOC Block Special Rendering -->
            <div v-if="block.type === 'toc'" class="toc-block" contenteditable="false">
            <div class="toc-header">Table of Contents</div>
            <div class="toc-content">
              <div v-if="getHeadings().length === 0" class="toc-empty">
                No headings found. Add H1-H6 to see them here.
              </div>
              <div 
                v-for="heading in getHeadings()" 
                  :key="heading.id"
                  class="toc-item"
                  :class="`toc-${heading.type}`"
                  @click="scrollToBlock(heading.id)"
                >
                  {{ heading.content || '(Empty Heading)' }}
                </div>
              </div>
            </div>

            <ContentBlock
              v-else
              v-model="block.content"
              :class="block.type"
              :placeholder="getPlaceholder(block.type)"
              @enter="(e) => handleEnter(e, block.id)"
              @backspace="(e) => handleBackspace(block.id, undefined, e)"
              @slash="handleSlash($event, block.id)"
              @double-colon="handleDoubleColon($event, block.id)"
            />
          </EditorBlock>

        </template>
      </div>
      
      <!-- Empty State -->
      <div 
        v-if="blocks.length === 0" 
        class="empty-editor"
        @click="addBlock('paragraph')"
      >
        Click to start writing...
      </div>

      <!-- Slash Menu -->
      <div v-if="showSlashMenu" class="slash-menu" :style="slashMenuStyle">
        <div class="menu-header">Basic Blocks</div>
        <button
          v-for="(item, idx) in filteredCommands"
          :key="idx"
          class="menu-item"
          :class="{ active: selectedCommandIndex === idx }"
          @click="executeCommand(item)"
          @mouseenter="selectedCommandIndex = idx"
        >
          <span class="menu-icon">{{ item.icon }}</span>
          <div class="menu-info">
            <span class="menu-label">{{ item.label }}</span>
            <span class="menu-desc">{{ item.desc }}</span>
          </div>
        </button>
      </div>

      <!-- Settings Menu (::) -->
      <div v-if="showSettingsMenu" class="settings-menu" :style="settingsMenuStyle">
        <div class="menu-header">Insert</div>
        <button
          v-for="(item, idx) in filteredSettings"
          :key="idx"
          class="menu-item"
          :class="{ active: selectedSettingIndex === idx }"
          @click="executeSetting(item)"
          @mouseenter="selectedSettingIndex = idx"
        >
          <span class="menu-icon">{{ item.icon }}</span>
          <div class="menu-info">
            <span class="menu-label">{{ item.label }}</span>
            <span class="menu-desc">{{ item.desc }}</span>
          </div>
        </button>
      </div>
        </div>
      </div>

      <!-- Preview Panel -->
      <div v-show="viewMode !== 'editor'" class="preview-panel">
        <div class="preview-content">
          <MarkdownRenderer :content="modelValue" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'
import EditorBlock from './blocks/EditorBlock.vue'
import ContentBlock from './blocks/ContentBlock.vue'
import MarkdownRenderer from '~/components/blog/MarkdownRenderer.vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])

// View mode
const viewMode = ref<'editor' | 'split' | 'preview'>('split')

// --- Types ---
interface Block {
  id: string
  type: 'paragraph' | 'heading-1' | 'heading-2' | 'heading-3' | 'heading-4' | 'heading-5' | 'heading-6' | 
        'callout' | 'row' | 'column' | 'quote' | 'code' | 'bulleted-list' | 'numbered-list' | 
        'todo' | 'divider' | 'image' | 'table' | 'toc'
  content: string
  children?: Block[]
  width?: number // Percentage for columns
  language?: string // For code blocks
  checked?: boolean // For todo items
}

interface Command {
  label: string
  desc: string
  icon: string
  type: Block['type']
}

interface Setting {
  label: string
  desc: string
  icon: string
  action: string
}

// --- State ---
const blocks = ref<Block[]>([])
const isInternalUpdate = ref(false)
const isUndoing = ref(false)
const editorWrapper = ref<HTMLElement | null>(null)
const blocksList = ref<HTMLElement | null>(null)
const skipEnsureNext = ref(false)
const history = ref<Block[][]>([])
const historyIndex = ref(-1)

// Slash Menu
const showSlashMenu = ref(false)
const activeBlockId = ref<string | null>(null)
const slashMenuQuery = ref('')
const selectedCommandIndex = ref(0)
const slashMenuPosition = ref({ top: 0, left: 0 })

// Settings Menu (::)
const showSettingsMenu = ref(false)
const settingsMenuQuery = ref('')
const selectedSettingIndex = ref(0)
const settingsMenuPosition = ref({ top: 0, left: 0 })
const selectedBlockIds = ref<string[]>([])
const autoScrollDir = ref<0 | 1 | -1>(0)
let autoScrollFrame: number | null = null
const ensureColumnContent = () => {
  const fill = (list: Block[]) => {
    for (const b of list) {
      if (b.type === 'column') {
        if (!b.children || b.children.length === 0) {
          b.children = [{
            id: generateId(),
            type: 'paragraph',
            content: ''
          }]
        }
      }
      if (b.children) fill(b.children)
    }
  }
  fill(blocks.value)
}

const pruneLayouts = (list: Block[]) => {
  const normalizeRowWidths = (row: Block) => {
    if (!row.children || row.children.length === 0) return
    const n = row.children.length
    const w = 100 / n
    row.children.forEach(col => { col.width = w })
  }

  for (let i = list.length - 1; i >= 0; i--) {
    const b = list[i]
    if (b.children) {
      pruneLayouts(b.children)
    }

    if (b.type === 'column') {
      if (!b.children || b.children.length === 0) {
        list.splice(i, 1)
        continue
      }
    }

    if (b.type === 'row') {
      const cols = b.children || []
      const filtered = cols.filter(col => col.children && col.children.length > 0)
      b.children = filtered

      if (!b.children || b.children.length === 0) {
        list.splice(i, 1)
        continue
      }

      if (b.children.length === 1) {
        const onlyCol = b.children[0]
        const childrenToLift = onlyCol.children || []
        list.splice(i, 1, ...childrenToLift)
      } else {
        normalizeRowWidths(b)
      }
    }
  }
}

const commands: Command[] = [
  // Text blocks
  { label: 'Paragraph', desc: 'Plain text', icon: '¶', type: 'paragraph' },
  { label: 'Heading 1', desc: 'Big section heading', icon: 'H1', type: 'heading-1' },
  { label: 'Heading 2', desc: 'Medium section heading', icon: 'H2', type: 'heading-2' },
  { label: 'Heading 3', desc: 'Small section heading', icon: 'H3', type: 'heading-3' },
  { label: 'Heading 4', desc: 'Smaller heading', icon: 'H4', type: 'heading-4' },
  { label: 'Heading 5', desc: 'Minor heading', icon: 'H5', type: 'heading-5' },
  { label: 'Heading 6', desc: 'Smallest heading', icon: 'H6', type: 'heading-6' },
  // Lists
  { label: 'Bulleted List', desc: 'Create a bulleted list', icon: '•', type: 'bulleted-list' },
  { label: 'Numbered List', desc: 'Create a numbered list', icon: '1.', type: 'numbered-list' },
  { label: 'To-do List', desc: 'Track tasks with checkboxes', icon: '☑', type: 'todo' },
  // Rich content
  { label: 'Quote', desc: 'Capture a quote', icon: '❝', type: 'quote' },
  { label: 'Code Block', desc: 'Code snippet with syntax', icon: '💻', type: 'code' },
  { label: 'Callout', desc: 'Highlighted note', icon: '💡', type: 'callout' },
  { label: 'Divider', desc: 'Horizontal line', icon: '—', type: 'divider' },
  // Media
  { label: 'Image', desc: 'Upload or embed image', icon: '🖼️', type: 'image' },
  { label: 'Table', desc: 'Insert a table', icon: '▦', type: 'table' },
  { label: 'Table of Contents', desc: 'Insert a table of contents', icon: '📑', type: 'toc' }
]

const settings: Setting[] = [
  // Formatting
  { label: 'Bold', desc: 'Make text bold **text**', icon: 'B', action: 'bold' },
  { label: 'Italic', desc: 'Make text italic *text*', icon: 'I', action: 'italic' },
  { label: 'Strikethrough', desc: 'Strike through text', icon: 'S', action: 'strikethrough' },
  { label: 'Inline Code', desc: 'Inline code snippet', icon: '`', action: 'inline-code' },
  // Links & Media
  { label: 'Link', desc: 'Add a hyperlink', icon: '🔗', action: 'link' },
  { label: 'Image', desc: 'Upload or embed image', icon: '🖼️', action: 'image' },
  { label: 'Table of Contents', desc: 'Auto-generate headings list', icon: '📑', action: 'toc' },
  // Embeds
  { label: 'YouTube', desc: 'Embed YouTube video', icon: '▶️', action: 'youtube' },
  { label: 'Tweet', desc: 'Embed a tweet', icon: '🐦', action: 'tweet' },
  { label: 'CodePen', desc: 'Embed CodePen', icon: '✏️', action: 'codepen' },
  { label: 'GitHub Gist', desc: 'Embed a gist', icon: '📋', action: 'gist' }
]

// --- Helpers for TOC / slugging ---
const headingLevelMap: Record<Block['type'], number | undefined> = {
  'heading-1': 1,
  'heading-2': 2,
  'heading-3': 3,
  'heading-4': 4,
  'heading-5': 5,
  'heading-6': 6,
  paragraph: undefined,
  callout: undefined,
  row: undefined,
  column: undefined,
  quote: undefined,
  code: undefined,
  'bulleted-list': undefined,
  'numbered-list': undefined,
  todo: undefined,
  divider: undefined,
  image: undefined,
  table: undefined,
  toc: undefined
}

const createSlugger = () => {
  const counts: Record<string, number> = {}
  return (text: string) => {
    const base = text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      || 'heading'
    const count = (counts[base] || 0) + 1
    counts[base] = count
    return count > 1 ? `${base}-${count}` : base
  }
}

const matchHeadingBlock = (block: Block): { level: number, text: string } | null => {
  const levelFromType = headingLevelMap[block.type]
  if (levelFromType) {
    return { level: levelFromType, text: block.content || '' }
  }
  // Allow markdown-style headings even if block type is paragraph
  const match = (block.content || '').match(/^(#{1,6})\s+(.+)/)
  if (match) {
    return { level: match[1].length, text: match[2] }
  }
  return null
}

const buildTocEntries = () => {
  const slug = createSlugger()
  const entries: Array<{ level: number; text: string; slug: string }> = []

  const traverse = (list: Block[]) => {
    for (const block of list) {
      const heading = matchHeadingBlock(block)
      if (heading) {
        const text = heading.text || '(Empty Heading)'
        entries.push({
          level: heading.level,
          text,
          slug: slug(text)
        })
      }
      if (block.children) traverse(block.children)
    }
  }

  traverse(blocks.value)
  return entries
}

const isSelected = (id: string) => selectedBlockIds.value.includes(id)

const pushHistory = () => {
  const snapshot = JSON.parse(JSON.stringify(blocks.value)) as Block[]
  // Truncate future history if we've undone
  if (historyIndex.value < history.value.length - 1) {
    history.value = history.value.slice(0, historyIndex.value + 1)
  }
  history.value.push(snapshot)
  historyIndex.value = history.value.length - 1
}

const undo = () => {
  if (historyIndex.value <= 0) return
  historyIndex.value -= 1
  const snapshot = history.value[historyIndex.value]
  if (!snapshot) return
  isUndoing.value = true
  blocks.value = JSON.parse(JSON.stringify(snapshot))
  nextTick(() => {
    isUndoing.value = false
  })
}

const toggleSelect = (id: string, event?: MouseEvent) => {
  const multi = event?.metaKey || event?.ctrlKey || event?.shiftKey
  if (!multi) {
    selectedBlockIds.value = [id]
    return
  }

  if (selectedBlockIds.value.includes(id)) {
    selectedBlockIds.value = selectedBlockIds.value.filter(bid => bid !== id)
  } else {
    selectedBlockIds.value = [...selectedBlockIds.value, id]
  }
}

const clearSelection = () => {
  selectedBlockIds.value = []
}

const removeBlocksByIds = (ids: string[]) => {
  const removed: Block[] = []

  const removeFromList = (list: Block[]) => {
    for (let i = list.length - 1; i >= 0; i--) {
      const b = list[i]
      if (ids.includes(b.id)) {
        removed.unshift(...list.splice(i, 1))
      } else if (b.children) {
        removeFromList(b.children)
      }
    }
  }

  removeFromList(blocks.value)
  pruneLayouts(blocks.value)
  skipEnsureNext.value = true

  // Ensure at least one block remains
  if (blocks.value.length === 0) {
    addBlock('paragraph')
  }

  return removed
}

const onGlobalKeydown = (e: KeyboardEvent) => {
  if (typeof document === 'undefined') return
  const active = document.activeElement as HTMLElement | null

  // Undo (Cmd/Ctrl + Z)
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
    e.preventDefault()
    undo()
    return
  }

  // Arrow navigation between selected blocks (when wrapper is selected, not contenteditable)
  if (selectedBlockIds.value.length && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
    if (active?.closest('.content-block-input')) return
    const ids = orderedBlockIds()
    const currentId = selectedBlockIds.value[selectedBlockIds.value.length - 1]
    const idx = ids.indexOf(currentId)
    if (idx !== -1) {
      const nextIdx = e.key === 'ArrowDown' ? Math.min(ids.length - 1, idx + 1) : Math.max(0, idx - 1)
      const nextId = ids[nextIdx]
      if (nextId && nextId !== currentId) {
        e.preventDefault()
        selectedBlockIds.value = [nextId]
        focusBlockInput(nextId, e.key === 'ArrowDown')
      }
    }
  }

  // Delete selected blocks (only when focus is outside contenteditable)
  if (selectedBlockIds.value.length && (e.key === 'Delete' || e.key === 'Backspace')) {
    if (active?.closest('.content-block-input')) return
    e.preventDefault()
    removeBlocksByIds(selectedBlockIds.value)
    clearSelection()
    return
  }
}

const stopAutoScroll = () => {
  autoScrollDir.value = 0
  if (autoScrollFrame !== null && typeof cancelAnimationFrame !== 'undefined') {
    cancelAnimationFrame(autoScrollFrame)
    autoScrollFrame = null
  }
}

const autoScrollStep = () => {
  if (!autoScrollDir.value) {
    autoScrollFrame = null
    return
  }
  const container = editorWrapper.value
  const speed = 12 * autoScrollDir.value
  if (container) {
    container.scrollTop += speed
  } else if (typeof window !== 'undefined') {
    window.scrollBy(0, speed)
  }
  autoScrollFrame = requestAnimationFrame(autoScrollStep)
}

const startAutoScroll = (dir: 1 | -1 | 0) => {
  if (dir === autoScrollDir.value) return
  autoScrollDir.value = dir
  if (dir === 0) {
    stopAutoScroll()
    return
  }
  if (autoScrollFrame === null && typeof requestAnimationFrame !== 'undefined') {
    autoScrollFrame = requestAnimationFrame(autoScrollStep)
  }
}

const handleDragHover = (clientY: number | null) => {
  if (clientY === null) {
    stopAutoScroll()
    return
  }
  if (typeof document === 'undefined') return

  const rect = editorWrapper.value?.getBoundingClientRect()
  if (!rect) return

  const threshold = 60
  if (clientY < rect.top + threshold) {
    startAutoScroll(-1)
  } else if (clientY > rect.bottom - threshold) {
    startAutoScroll(1)
  } else {
    startAutoScroll(0)
  }
}

// --- Computed ---
const filteredCommands = computed(() => {
  const q = slashMenuQuery.value.toLowerCase()
  return commands.filter(c => c.label.toLowerCase().includes(q))
})

const filteredSettings = computed(() => {
  const q = settingsMenuQuery.value.toLowerCase()
  return settings.filter(s => s.label.toLowerCase().includes(q))
})

const slashMenuStyle = computed(() => ({
  top: `${slashMenuPosition.value.top}px`,
  left: `${slashMenuPosition.value.left}px`
}))

const settingsMenuStyle = computed(() => ({
  top: `${settingsMenuPosition.value.top}px`,
  left: `${settingsMenuPosition.value.left}px`
}))

// --- Lifecycle ---
onMounted(() => {
  if (props.modelValue) {
    parseMarkdown(props.modelValue)
  } else {
    addBlock('paragraph')
  }
  pushHistory()

  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', onGlobalKeydown)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', onGlobalKeydown)
  }
})

watch(() => props.modelValue, (newVal) => {
  if (!isInternalUpdate.value && newVal !== serializeMarkdown()) {
    parseMarkdown(newVal)
  }
})

watch(blocks, () => {
  isInternalUpdate.value = true
  const markdown = serializeMarkdown()
  emit('update:modelValue', markdown)
  nextTick(() => {
    isInternalUpdate.value = false
  })
}, { deep: true })

watch(blocks, () => {
  if (skipEnsureNext.value) {
    skipEnsureNext.value = false
    return
  }
  ensureColumnContent()
}, { deep: true, flush: 'post' })

watch(blocks, () => {
  if (isInternalUpdate.value || isUndoing.value) return
  pushHistory()
}, { deep: true, flush: 'post' })

// --- Helpers ---
const generateId = () => Math.random().toString(36).substr(2, 9)

const getPlaceholder = (type: string) => {
  switch (type) {
    case 'heading-1': return 'Heading 1'
    case 'heading-2': return 'Heading 2'
    case 'heading-3': return 'Heading 3'
    case 'heading-4': return 'Heading 4'
    case 'heading-5': return 'Heading 5'
    case 'heading-6': return 'Heading 6'
    case 'quote': return 'Quote...'
    case 'code': return 'Enter code...'
    case 'bulleted-list': return 'List item'
    case 'numbered-list': return 'List item'
    case 'todo': return 'To-do item'
    case 'callout': return 'Callout text...'
    case 'image': return 'Enter image URL or drag & drop'
    case 'table': return 'Table'
    case 'divider': return ''
    default: return 'Type / for commands, :: for insert...'
  }
}

// Recursive finder
const findBlockPath = (id: string, list: Block[], path: { list: Block[], index: number }[] = []): { list: Block[], index: number }[] | null => {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      return [...path, { list, index: i }]
    }
    if (list[i].children) {
      const found = findBlockPath(id, list[i].children!, [...path, { list, index: i }])
      if (found) return found
    }
  }
  return null
}

// --- Parsing (Robust DOMParser) ---
const parseMarkdown = (text: string) => {
  // 1. Convert Markdown to HTML-ish structure
  // Since we store layout as HTML, we can parse it.
  // Standard markdown text needs to be handled too.
  
  // Strategy: 
  // We will assume the input is a mix of HTML layout divs and markdown text.
  // We'll wrap it in a root div and parse.
  
  // Note: Standard markdown paragraphs might not be wrapped in <p>, so DOMParser might treat them as text nodes.
  
  const parser = new DOMParser()
  // Pre-process: Ensure double newlines are respected if we treat them as blocks?
  // Actually, let's trust the DOMParser to handle the layout divs, and treat text nodes as blocks.
  
  const doc = parser.parseFromString(`<body>${text}</body>`, 'text/html')
  const root = doc.body
  
  const newBlocks: Block[] = []
  
  Array.from(root.childNodes).forEach(node => {
    const block = parseNode(node)
    if (block) {
      if (Array.isArray(block)) {
        newBlocks.push(...block)
      } else {
        newBlocks.push(block)
      }
    }
  })
  
  blocks.value = newBlocks
}

  const parseNode = (node: Node): Block | Block[] | null => {
  if (node.nodeType === Node.TEXT_NODE) {
    const content = node.textContent?.trim()
    if (!content) return null
    // Split by newlines to create multiple paragraphs if needed
    return content.split(/\n\n+/).map(text => ({
      id: generateId(),
      type: 'paragraph',
      content: text
    }))
  }
  
  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as HTMLElement
    
    // Row
    if (el.classList.contains('layout-row') || el.classList.contains('layout-grid-2')) {
      const children: Block[] = []
      Array.from(el.children).forEach(colEl => {
        // Columns are direct children divs
        const colChildren: Block[] = []
        Array.from(colEl.childNodes).forEach(child => {
          const b = parseNode(child)
          if (b) Array.isArray(b) ? colChildren.push(...b) : colChildren.push(b)
        })
        
        children.push({
          id: generateId(),
          type: 'column',
          content: '',
          children: colChildren
        })
      })
      
      return {
        id: generateId(),
        type: 'row',
        content: '',
        children
      }
    }
    
    // Callout
    if (el.classList.contains('callout')) {
      const contentEl = el.querySelector('.callout-content')
      return {
        id: generateId(),
        type: 'callout',
        content: contentEl?.textContent?.trim() || el.textContent?.trim() || ''
      }
    }

    // TOC
    if (el.classList.contains('toc-block')) {
      return {
        id: generateId(),
        type: 'toc',
        content: ''
      }
    }
    
    // Headings (if passed as HTML)
    if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(el.tagName)) {
      return {
        id: generateId(),
        type: `heading-${el.tagName.charAt(1)}` as any,
        content: el.textContent?.trim() || ''
      }
    }
    
    // Fallback for other elements: treat as text or recurse?
    // For now, treat outer HTML as content if it's not a layout
    // But better to just extract text to avoid nesting weirdness
    const content = el.textContent?.trim()
    if (!content) return null
    return {
      id: generateId(),
      type: 'paragraph',
      content
    }
  }
  
  return null
}

// --- Serialization ---
const serializeMarkdown = () => {
  return blocks.value.map(serializeBlock).join('\n\n')
}

const serializeBlock = (block: Block): string => {
  if (block.type === 'row' && block.children) {
    const cols = block.children.map(col => {
      const colContent = col.children?.map(serializeBlock).join('\n\n') || ''
      return `<div class="layout-col">\n\n${colContent}\n\n</div>`
    }).join('\n')
    return `<div class="layout-row">\n${cols}\n</div>`
  }
  
  switch (block.type) {
    case 'heading-1': return `# ${block.content}`
    case 'heading-2': return `## ${block.content}`
    case 'heading-3': return `### ${block.content}`
    case 'heading-4': return `#### ${block.content}`
    case 'heading-5': return `##### ${block.content}`
    case 'heading-6': return `###### ${block.content}`
    case 'quote': return `> ${block.content}`
    case 'code': 
      return '```' + (block.language || '') + '\n' + block.content + '\n```'
    case 'bulleted-list':
      return block.content.split('\n').map(line => `- ${line}`).join('\n')
    case 'numbered-list':
      return block.content.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n')
    case 'todo':
      return block.checked ? `- [x] ${block.content}` : `- [ ] ${block.content}`
    case 'divider': return '---'
    case 'image': 
      return `![${block.content || 'image'}](${block.content})`
    case 'table':
      return block.content || '| Column 1 | Column 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |'
    case 'callout':
      return `<div class="callout"><span class="callout-icon">💡</span><div class="callout-content">${block.content}</div></div>`
    case 'toc': {
      const entries = buildTocEntries()
      if (!entries.length) {
        return `<div class="toc-block"><div class="toc-header">Table of Contents</div><div class="toc-empty">No headings found.</div></div>`
      }
      const items = entries.map(e => 
        `<li class="toc-item toc-h${e.level}"><a href="#${e.slug}">${e.text}</a></li>`
      ).join('')
      return `<div class="toc-block"><div class="toc-header">Table of Contents</div><ul class="toc-list">${items}</ul></div>`
    }
    default:
      return block.content
  }
}

// --- Toolbar Actions ---
const wrapSelection = (wrapper: string) => {
  if (typeof window === 'undefined') return
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return
  
  const range = selection.getRangeAt(0)
  const selectedText = range.toString()
  
  if (selectedText) {
    const wrappedText = wrapper + selectedText + wrapper
    range.deleteContents()
    range.insertNode(document.createTextNode(wrappedText))
  }
}

const insertLink = () => {
  const url = prompt('Enter URL:')
  const text = prompt('Enter link text:') || url
  if (url) {
    if (typeof window === 'undefined') return
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.deleteContents()
      range.insertNode(document.createTextNode(`[${text}](${url})`))
    }
  }
}

// --- Actions ---
const addBlock = (type: Block['type']) => {
  let content = ''
  let language = undefined
  
  // Set default content for certain block types
  switch (type) {
    case 'table':
      content = '| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |'
      break
    case 'code':
      language = 'javascript'
      break
    case 'divider':
      content = '---'
      break
  }
  
  blocks.value.push({
    id: generateId(),
    type: type === 'row' ? 'paragraph' : type,
    content,
    language,
    checked: type === 'todo' ? false : undefined
  })
}

// Handle click on empty editor area
const handleEditorClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  
  // Check if clicked on editor-wrapper or blocks-list directly (not on a block)
  if (target === editorWrapper.value || target === blocksList.value) {
    clearSelection()
    // Add a new paragraph block
    const newBlock: Block = {
      id: generateId(),
      type: 'paragraph',
      content: ''
    }
    blocks.value.push(newBlock)
    
    // Focus the new block after rendering
    nextTick(() => {
      const el = document.querySelector(`[data-block-id="${newBlock.id}"] [contenteditable]`) as HTMLElement
      if (el) {
        el.focus()
      }
    })
  }
}

// Handle drag over empty editor area
const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move'
  }
}

// Handle drop on empty editor area
const handleDrop = async (e: DragEvent) => {
  const target = e.target as HTMLElement
  
  // Only handle if dropped on editor-wrapper or blocks-list directly
  if (target === editorWrapper.value || target === blocksList.value) {
    e.preventDefault()
    clearSelection()
    
    // Handle files
    if (e.dataTransfer?.files.length) {
      const file = e.dataTransfer.files[0]
      if (file && file.type.startsWith('image/')) {
        const { uploadImage } = useUpload()
        
        // Create a temporary image block
        const tempId = generateId()
        blocks.value.push({
          id: tempId,
          type: 'image',
          content: 'Uploading...'
        })
        
        const url = await uploadImage(file)
        
        // Find the block and update it
        const blockIndex = blocks.value.findIndex(b => b.id === tempId)
        if (blockIndex !== -1) {
          if (url) {
            blocks.value[blockIndex].content = url
          } else {
            // Remove block if upload failed
            blocks.value.splice(blockIndex, 1)
          }
        }
        return
      }
    }
    
    const data = e.dataTransfer?.getData('application/json')
    if (!data) return
    const parsed = JSON.parse(data)
    const idsToMove: string[] = parsed.ids && parsed.ids.length ? parsed.ids : [parsed.id || parsed.blockId].filter(Boolean)
    if (!idsToMove.length) return

    const movedBlocks = removeBlocksByIds(idsToMove)
    if (movedBlocks.length) {
      blocks.value.push(...movedBlocks)
      selectedBlockIds.value = idsToMove
    }
  }
}

const handleEnter = (event: { afterText: string } | Event, blockId?: string, parentId?: string) => {
  // Handle both old Event signature and new object signature
  const afterText = typeof event === 'object' && 'afterText' in event ? event.afterText : ''
  const actualBlockId = blockId || (typeof event === 'object' && 'target' in event ? '' : '')
  
  if (showSlashMenu.value) {
    executeCommand(filteredCommands.value[selectedCommandIndex.value])
    return
  }
  
  // If called with old signature, blockId is in first param
  const searchId = actualBlockId || blockId
  if (!searchId) return
  
  const path = findBlockPath(searchId, blocks.value)
  if (path) {
    const { list, index } = path[path.length - 1]
    const newBlock: Block = {
      id: generateId(),
      type: 'paragraph',
      content: afterText || ''
    }
    list.splice(index + 1, 0, newBlock)
    
    selectedBlockIds.value = [newBlock.id]
    
    // Focus the new block after rendering
    nextTick(() => {
      if (typeof document === 'undefined') return
      
      const currentElement = document.activeElement
      if (currentElement) {
        const parentBlock = currentElement.closest('.editor-block-wrapper')
        if (parentBlock) {
          const nextBlock = parentBlock.nextElementSibling
          if (nextBlock) {
            const nextInput = nextBlock.querySelector('.content-block-input') as HTMLElement
            if (nextInput) {
              nextInput.focus()
              // Place cursor at the start of the new block
              const range = document.createRange()
              const sel = window.getSelection()
              range.setStart(nextInput, 0)
              range.collapse(true)
              sel?.removeAllRanges()
              sel?.addRange(range)
              nextInput.scrollIntoView({ block: 'nearest' })
            }
          }
        }
      }
    })
  }
}

const findPreviousBlock = (id: string) => {
  let prev: Block | null = null
  const walk = (list: Block[]): boolean => {
    for (const b of list) {
      // Only treat non-container blocks as "previous" content
      if (b.type !== 'row' && b.type !== 'column') {
        prev = b
      }
      if (b.id === id) return true
      if (b.children && walk(b.children)) return true
    }
    return false
  }
  walk(blocks.value)
  return prev
}

const orderedBlockIds = () => {
  const ids: string[] = []
  const traverse = (list: Block[]) => {
    for (const b of list) {
      if (b.type !== 'row' && b.type !== 'column') {
        ids.push(b.id)
      }
      if (b.children) traverse(b.children)
    }
  }
  traverse(blocks.value)
  return ids
}

const focusBlockInput = (id: string, toEnd = true) => {
  if (typeof document === 'undefined') return
  const el = document.querySelector(`[data-block-id="${id}"] .content-block-input`) as HTMLElement | null
  if (!el) return
  el.focus()
  const range = document.createRange()
  range.selectNodeContents(el)
  range.collapse(toEnd)
  const sel = window.getSelection()
  sel?.removeAllRanges()
  sel?.addRange(range)
  el.scrollIntoView({ block: 'nearest' })
}

const handleBackspace = (blockId: string, parentId?: string, payload?: any) => {
  const path = findBlockPath(blockId, blocks.value)
  if (path) {
    const { list, index } = path[path.length - 1]
    const block = list[index]
    const isMerge = payload && typeof payload === 'object' && payload.merge

    // Merge with previous block when backspace at start
    if (isMerge) {
      // If there is a previous sibling in the same list
      if (index > 0) {
        const prevBlock = list[index - 1]
        prevBlock.content = (prevBlock.content || '') + (block.content || '')
        list.splice(index, 1)
        pruneLayouts(blocks.value)
        skipEnsureNext.value = true

        nextTick(() => {
          const prevEl = document.querySelector(`[data-block-id="${prevBlock.id}"] .content-block-input`) as HTMLElement | null
          if (prevEl) {
            prevEl.focus()
            const range = document.createRange()
            range.selectNodeContents(prevEl)
            range.collapse(false)
            const sel = window.getSelection()
            sel?.removeAllRanges()
            sel?.addRange(range)
          }
        })
        return
      }

      // If first in list, find previous block in document order
      const prev = findPreviousBlock(blockId)
      if (prev) {
        prev.content = (prev.content || '') + (block.content || '')
        list.splice(index, 1)
        pruneLayouts(blocks.value)
        skipEnsureNext.value = true
        nextTick(() => {
          const prevEl = document.querySelector(`[data-block-id="${prev.id}"] .content-block-input`) as HTMLElement | null
          if (prevEl) {
            prevEl.focus()
            const range = document.createRange()
            range.selectNodeContents(prevEl)
            range.collapse(false)
            const sel = window.getSelection()
            sel?.removeAllRanges()
            sel?.addRange(range)
          }
        })
        return
      }
    }

    // Delete block if content is empty
    if (block.content === '' || block.content.trim() === '') {
      if (list.length > 1) {
        list.splice(index, 1)
        
        // Focus previous block
        nextTick(() => {
          if (typeof document === 'undefined') return
          const editables = document.querySelectorAll('.content-block-input')
          const prevIndex = Math.max(0, index - 1)
          if (editables[prevIndex]) {
            (editables[prevIndex] as HTMLElement).focus()
          }
        })
      } else if (list.length === 1) {
        // Check if this block is inside a column layout
        if (parentId) {
          // Find the parent column block
          const parentPath = findBlockPath(parentId, blocks.value)
          if (parentPath) {
            const parentInfo = parentPath[parentPath.length - 1]
            const parentBlock = parentInfo.list[parentInfo.index]
            
            // Check if parent has a grandparent column-layout
            if (parentPath.length >= 2) {
              const grandparentInfo = parentPath[parentPath.length - 2]
              const columnLayout = grandparentInfo.list[grandparentInfo.index]
              
              if (columnLayout.type === 'row' && columnLayout.children) {
                // Find other columns with content
                const otherColumns = columnLayout.children.filter(col => 
                  col.id !== parentId && col.children && col.children.length > 0
                )
                
                if (otherColumns.length > 0) {
                  // Move a block from another column to fill the empty space
                  const sourceColumn = otherColumns[0]
                  if (sourceColumn.children && sourceColumn.children.length > 0) {
                    const movedBlock = sourceColumn.children.pop()
                    if (movedBlock) {
                      // Replace the empty block with the moved block
                      list.splice(index, 1, movedBlock)
                      
                      // If source column is now empty, remove the entire column layout
                      // and keep remaining blocks at root level
                      cleanupEmptyColumnLayout(columnLayout, grandparentInfo)
                    }
                  }
                } else {
                  // All columns empty or this is the last one - remove entire column layout
                  list.splice(index, 1)
                  cleanupEmptyColumnLayout(columnLayout, grandparentInfo)
                }
              }
            }
          }
        } else if (blocks.value.length > 1) {
          // If this is the only block in a nested list but there are other root blocks
          list.splice(index, 1)
        }
      }
      // If it's the last block in the editor, keep it but don't delete
    }
  }
}

// Helper function to cleanup empty column layouts
const cleanupEmptyColumnLayout = (columnLayout: Block, parentInfo: { list: Block[], index: number }) => {
  if (!columnLayout.children) return
  
  // Check if all columns are empty
  const allEmpty = columnLayout.children.every(col => 
    !col.children || col.children.length === 0
  )
  
  if (allEmpty) {
    // Remove the entire column layout
    parentInfo.list.splice(parentInfo.index, 1)
    
    // Ensure there's at least one block
    if (blocks.value.length === 0) {
      addBlock('paragraph')
    }
  } else {
    // Check if only one column has content
    const nonEmptyColumns = columnLayout.children.filter(col => 
      col.children && col.children.length > 0
    )
    
    if (nonEmptyColumns.length === 1) {
      // Flatten: move all blocks from the single column to root level
      const remainingBlocks = nonEmptyColumns[0].children || []
      parentInfo.list.splice(parentInfo.index, 1, ...remainingBlocks)
    }
  }
}

// --- Slash Menu ---
const handleSlash = (event: Event, blockId: string) => {
  if (typeof document === 'undefined') return
  
  const target = event.target as HTMLElement
  const rect = target.getBoundingClientRect()
  
  activeBlockId.value = blockId
  slashMenuPosition.value = {
    top: rect.bottom + 5,
    left: rect.left
  }
  
  showSlashMenu.value = true
  slashMenuQuery.value = ''
  selectedCommandIndex.value = 0
  
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', onSlashMenuKeydown)
  }
}

const onSlashMenuKeydown = (e: KeyboardEvent) => {
  if (!showSlashMenu.value) {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', onSlashMenuKeydown)
    }
    return
  }
  
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selectedCommandIndex.value = (selectedCommandIndex.value + 1) % filteredCommands.value.length
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectedCommandIndex.value = (selectedCommandIndex.value - 1 + filteredCommands.value.length) % filteredCommands.value.length
  } else if (e.key === 'Enter') {
    e.preventDefault()
    executeCommand(filteredCommands.value[selectedCommandIndex.value])
  } else if (e.key === 'Escape') {
    closeSlashMenu()
  }
}

const closeSlashMenu = () => {
  showSlashMenu.value = false
  activeBlockId.value = null
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', onSlashMenuKeydown)
  }
}

const executeCommand = (command: Command) => {
  if (!activeBlockId.value) return
  
  const path = findBlockPath(activeBlockId.value, blocks.value)
  if (path) {
    const { list, index } = path[path.length - 1]
    const block = list[index]
    block.content = block.content.replace('/', '') 
    block.type = command.type
  }
  
  closeSlashMenu()
}

// --- Settings Menu (::) ---
type RectLike = { top: number, left: number, bottom: number, right: number }
type DoubleColonPayload = Event | { targetRect?: RectLike | null, selectionRect?: RectLike | null, originalEvent?: Event }

const resolveRect = (payload: DoubleColonPayload, blockId: string): RectLike | null => {
  if (typeof document === 'undefined') return null

  // Prefer selection rect (cursor location)
  if (!(payload instanceof Event) && payload?.selectionRect) {
    return payload.selectionRect
  }
  // Fallback to target rect sent from child
  if (!(payload instanceof Event) && payload?.targetRect) {
    return payload.targetRect
  }
  // Fallback to event target
  const event = payload instanceof Event ? payload : payload.originalEvent
  const target = event?.target as HTMLElement | null
  if (target?.getBoundingClientRect) {
    return target.getBoundingClientRect()
  }
  // Final fallback: query the block element
  const el = document.querySelector(`[data-block-id="${blockId}"] .content-block-input`) as HTMLElement | null
  return el?.getBoundingClientRect() || null
}

const handleDoubleColon = (payload: DoubleColonPayload, blockId: string) => {
  if (typeof document === 'undefined') return
  
  const rect = resolveRect(payload, blockId)
  if (!rect) return
  
  closeSlashMenu()
  activeBlockId.value = blockId
  settingsMenuPosition.value = {
    top: rect.bottom + 5,
    left: rect.left
  }
  
  showSettingsMenu.value = true
  settingsMenuQuery.value = ''
  selectedSettingIndex.value = 0
  
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', onSettingsMenuKeydown)
  }
}

const onSettingsMenuKeydown = (e: KeyboardEvent) => {
  if (!showSettingsMenu.value) {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', onSettingsMenuKeydown)
    }
    return
  }
  
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selectedSettingIndex.value = (selectedSettingIndex.value + 1) % filteredSettings.value.length
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectedSettingIndex.value = (selectedSettingIndex.value - 1 + filteredSettings.value.length) % filteredSettings.value.length
  } else if (e.key === 'Enter') {
    e.preventDefault()
    executeSetting(filteredSettings.value[selectedSettingIndex.value])
  } else if (e.key === 'Escape') {
    closeSettingsMenu()
  }
}

const closeSettingsMenu = () => {
  showSettingsMenu.value = false
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', onSettingsMenuKeydown)
  }
}

const executeSetting = (setting: Setting) => {
  if (!activeBlockId.value) return
  
  const path = findBlockPath(activeBlockId.value, blocks.value)
  if (path) {
    const { list, index } = path[path.length - 1]
    const block = list[index]
    // Remove :: from content
    block.content = block.content.replace('::', '')
    
    // Insert content based on action
    switch (setting.action) {
      case 'bold':
        block.content += '**bold text**'
        break
      case 'italic':
        block.content += '*italic text*'
        break
      case 'strikethrough':
        block.content += '~~strikethrough~~'
        break
      case 'inline-code':
        block.content += '`code`'
        break
      case 'toc':
        block.type = 'toc'
        block.content = ''
        break
      case 'link':
        const linkUrl = prompt('Enter URL:')
        const linkText = prompt('Enter link text:') || linkUrl
        if (linkUrl) {
          block.content += `[${linkText}](${linkUrl})`
        }
        break
      case 'image':
        const imgUrl = prompt('Enter image URL:')
        const imgAlt = prompt('Enter image description:') || 'Image'
        if (imgUrl) {
          block.content += `![${imgAlt}](${imgUrl})`
        }
        break
      case 'youtube':
        const youtubeUrl = prompt('Enter YouTube URL:')
        if (youtubeUrl) {
          const videoId = youtubeUrl.match(/(?:v=|youtu\.be\/|embed\/)([^&\s?#]+)/)?.[1]
          if (videoId) {
            block.content += `\n<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>\n`
          } else {
            block.content += `\n${youtubeUrl}\n`
          }
        }
        break
      case 'tweet':
        const tweetUrl = prompt('Enter Tweet URL:')
        if (tweetUrl) {
          block.content += `\n<blockquote class="twitter-tweet"><a href="${tweetUrl}"></a></blockquote>\n<scr` + `ipt async src="https://platform.twitter.com/widgets.js"></scr` + `ipt>\n`
        }
        break
      case 'codepen':
        const codepenUrl = prompt('Enter CodePen URL:')
        if (codepenUrl) {
          block.content += `\n<iframe height="400" style="width: 100%;" scrolling="no" src="${codepenUrl.replace('/pen/', '/embed/')}" frameborder="no" allowfullscreen></iframe>\n`
        }
        break
      case 'gist':
        const gistUrl = prompt('Enter GitHub Gist URL:')
        if (gistUrl) {
          block.content += `\n<scr` + `ipt src="${gistUrl}.js"></scr` + `ipt>\n`
        }
        break
    }
  }
  
  closeSettingsMenu()
}

// --- Drag & Drop Logic (Advanced) ---
const handleReorder = ({ draggedId, draggedIds, targetId, position }: { draggedId: string, draggedIds?: string[], targetId: string, position: string }) => {
  const idsToMove = draggedIds && draggedIds.length ? draggedIds : [draggedId]
  if (idsToMove.includes(targetId)) return

  const movedBlocks = removeBlocksByIds(idsToMove)
  if (movedBlocks.length === 0) return
  
  const targetPath = findBlockPath(targetId, blocks.value)
  if (!targetPath) return
  
  const { list: targetList, index: targetIndex } = targetPath[targetPath.length - 1]
  const targetBlock = targetList[targetIndex]
  
  if (position === 'top') {
    targetList.splice(targetIndex, 0, ...movedBlocks)
  } else if (position === 'bottom') {
    targetList.splice(targetIndex + 1, 0, ...movedBlocks)
  } else if (position === 'left' || position === 'right') {
    if (targetPath.length >= 3) {
      const rowChildren = targetPath[targetPath.length - 2].list
      const colIndexInRow = targetPath[targetPath.length - 2].index
      
      const newCol: Block = {
        id: generateId(),
        type: 'column',
        content: '',
        children: [...movedBlocks]
      }
      
      if (position === 'left') {
        rowChildren.splice(colIndexInRow, 0, newCol)
      } else {
        rowChildren.splice(colIndexInRow + 1, 0, newCol)
      }
    } else {
      const newRow: Block = {
        id: generateId(),
        type: 'row',
        content: '',
        children: [
          { 
            id: generateId(), 
            type: 'column', 
            content: '', 
            children: position === 'left' ? [...movedBlocks] : [targetBlock] 
          },
          { 
            id: generateId(), 
            type: 'column', 
            content: '', 
            children: position === 'left' ? [targetBlock] : [...movedBlocks] 
          }
        ]
      }
      targetList.splice(targetIndex, 1, newRow)
    }
  }

  selectedBlockIds.value = idsToMove
}

const handleDropInEmptyColumn = (colId: string, e: DragEvent) => {
  const data = e.dataTransfer?.getData('application/json')
  if (!data) return
  const { id: draggedId, ids } = JSON.parse(data)
  const idsToMove = ids && ids.length ? ids : [draggedId]
  
  const movedBlocks = removeBlocksByIds(idsToMove)
  if (movedBlocks.length === 0) return
  
  const findColumn = (list: Block[]): Block | null => {
    for (const b of list) {
      if (b.id === colId) return b
      if (b.children) {
        const found = findColumn(b.children)
        if (found) return found
      }
    }
    return null
  }
  
  const colBlock = findColumn(blocks.value)
  if (colBlock && colBlock.children) {
    colBlock.children.push(...movedBlocks)
  }

  selectedBlockIds.value = idsToMove
}

// --- Column Resizing ---
const isResizing = ref(false)
const resizeState = ref<{
  block: Block
  colIndex: number
  startX: number
  startWidthLeft: number
  startWidthRight: number
} | null>(null)

const startColumnResize = (e: MouseEvent, block: Block, colIndex: number) => {
  if (!block.children || !block.children[colIndex] || !block.children[colIndex + 1]) return
  
  isResizing.value = true
  const leftCol = block.children[colIndex]
  const rightCol = block.children[colIndex + 1]
  
  // Initialize widths if not set
  if (!leftCol.width) leftCol.width = 100 / block.children.length
  if (!rightCol.width) rightCol.width = 100 / block.children.length
  
  resizeState.value = {
    block,
    colIndex,
    startX: e.clientX,
    startWidthLeft: leftCol.width,
    startWidthRight: rightCol.width
  }
  
  document.addEventListener('mousemove', handleColumnResize)
  document.addEventListener('mouseup', stopColumnResize)
  document.body.style.cursor = 'col-resize'
}

const handleColumnResize = (e: MouseEvent) => {
  if (!isResizing.value || !resizeState.value) return
  
  const { block, colIndex, startX, startWidthLeft, startWidthRight } = resizeState.value
  
  if (!block.children || !block.children[colIndex] || !block.children[colIndex + 1]) return

  const deltaX = e.clientX - startX
  
  // Calculate delta percentage based on container width
  const editorWidth = editorWrapper.value?.clientWidth || 800
  const deltaPercent = (deltaX / editorWidth) * 100
  
  const leftCol = block.children[colIndex]!
  const rightCol = block.children[colIndex + 1]!
  
  // Apply constraints (min 5% width)
  let newLeftWidth = startWidthLeft + deltaPercent
  let newRightWidth = startWidthRight - deltaPercent
  
  if (newLeftWidth < 5) {
    newLeftWidth = 5
    newRightWidth = startWidthLeft + startWidthRight - 5
  } else if (newRightWidth < 5) {
    newRightWidth = 5
    newLeftWidth = startWidthLeft + startWidthRight - 5
  }
  
  leftCol.width = newLeftWidth
  rightCol.width = newRightWidth
}

const stopColumnResize = () => {
  isResizing.value = false
  resizeState.value = null
  document.removeEventListener('mousemove', handleColumnResize)
  document.removeEventListener('mouseup', stopColumnResize)
  document.body.style.cursor = ''
}



// --- TOC Helpers ---
const getHeadings = () => {
  const headings: Array<Block & { level?: number }> = []
  const traverse = (list: Block[]) => {
    for (const block of list) {
      const heading = matchHeadingBlock(block)
      if (heading) {
        headings.push({ ...block, level: heading.level })
      }
      if (block.children) {
        traverse(block.children)
      }
    }
  }
  traverse(blocks.value)
  return headings
}

const scrollToBlock = (id: string) => {
  const el = document.querySelector(`[data-block-id="${id}"]`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

}

</script>

<style scoped>
.markdown-editor-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ffffff;
  font-family: 'Georgia', serif; /* Editorial feel */
  color: #333;
}



/* View Toggle */
.view-toggle {
  display: flex;
  justify-content: center;
  gap: 4px;
  background: #f5f5f5;
  padding: 4px;
  border-radius: 8px;
  width: fit-content;
  margin: 0 auto; /* Center the toggle group */
}

.toggle-btn {
  padding: 6px 16px;
  border: none;
  background: transparent;
  font-size: 13px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.toggle-btn:hover {
  color: #111;
}

.toggle-btn.active {
  background: #fff;
  color: #111;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

/* Editor Main Area */
.editor-main {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
}

.editor-main.split .editor-panel,
.editor-main.split .preview-panel {
  width: 50%;
}

.editor-main.editor .editor-panel {
  width: 100%;
  max-width: 800px; /* Centered max width for writing focus */
  margin: 0 auto;
  border-right: 1px solid #eee; /* Subtle border */
}

.editor-main.preview .preview-panel {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

/* Editor Panel */
.editor-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  border-right: 1px solid #f0f0f0;
  position: relative;
}

/* Toolbar */
.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 10;
  flex-wrap: wrap;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 2px;
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background: #e0e0e0;
  margin: 0 8px;
}

.toolbar-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  background: transparent;
  border-radius: 4px;
  color: #555;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.toolbar-btn:hover {
  background: #f5f5f5;
  color: #111;
  border-color: #e0e0e0;
}

.toolbar-italic { font-style: italic; font-family: serif; }
.toolbar-strikethrough { text-decoration: line-through; }
.toolbar-code { font-family: monospace; font-weight: bold; }

.toolbar-add {
  margin-left: auto;
  background: #111;
  color: #fff;
}

.toolbar-add:hover {
  background: #333;
  color: #fff;
  border-color: #333;
}

/* Editor Wrapper (Writing Area) */
.editor-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 24px 20px 12px;
  cursor: text;
}

.blocks-list {
  display: flex;
  flex-direction: column;
  gap: 16px; /* Spacing between blocks */
  min-height: 60vh;
}

/* Empty State */
.empty-editor {
  color: #999;
  font-style: italic;
  padding: 20px;
  text-align: center;
  cursor: text;
}

/* Preview Panel */
.preview-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ffffff; /* White bg for preview */
  overflow: hidden;
}



.preview-content {
  flex: 1;
  overflow-y: auto;
  padding: 40px 60px;
}

/* Block Styles */
.block-row {
  display: flex;
  gap: 24px;
}

.block-column {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
}

.column-resize-handle {
  width: 4px;
  cursor: col-resize;
  background: transparent;
  transition: background 0.2s;
  flex-shrink: 0;
  margin: 0 4px;
  border-radius: 2px;
}

.column-resize-handle:hover,
.column-resize-handle:active {
  background: #d1d5db;
}

/* Menus */
.slash-menu, .settings-menu {
  position: fixed;
  z-index: 9999;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  width: 280px;
  max-height: 320px;
  overflow-y: auto;
  padding: 6px;
}

.menu-header {
  padding: 6px 10px;
  font-size: 11px;
  text-transform: uppercase;
  color: #999;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 10px;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.1s;
}

.menu-item:hover, .menu-item.active {
  background: #f5f5f5;
}

.menu-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #eee;
  border-radius: 4px;
  background: #fff;
  font-size: 14px;
}

.menu-info {
  display: flex;
  flex-direction: column;
}

.menu-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.menu-desc {
  font-size: 12px;
  color: #888;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}
/* TOC Styles */
.toc-block {
  background: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 16px;
  margin: 8px 0;
}

.toc-header {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #999;
  margin-bottom: 12px;
  font-weight: 600;
}

.toc-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toc-empty {
  color: #ccc;
  font-style: italic;
  font-size: 13px;
}

.toc-item {
  cursor: pointer;
  color: #555;
  font-size: 14px;
  transition: color 0.2s;
}

.toc-item:hover {
  color: #111;
  text-decoration: underline;
}

.toc-heading-1 { margin-left: 0; font-weight: 500; }
.toc-heading-2 { margin-left: 16px; }
.toc-heading-3 { margin-left: 32px; font-size: 13px; }

</style>
