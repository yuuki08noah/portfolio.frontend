<template>
  <div class="markdown-editor-container">
    <div class="editor-toolbar">
      <button type="button" class="toolbar-btn" title="Add Block" @click="addBlock('paragraph')">＋</button>
      <span class="toolbar-divider"></span>
      <button type="button" class="toolbar-btn" title="Heading 1" @click="addBlock('heading-1')">H<sub>1</sub></button>
      <button type="button" class="toolbar-btn" title="Heading 2" @click="addBlock('heading-2')">H<sub>2</sub></button>
      <button type="button" class="toolbar-btn" title="Heading 3" @click="addBlock('heading-3')">H<sub>3</sub></button>
      <span class="toolbar-divider"></span>
      <button type="button" class="toolbar-btn" title="Bold" @click="wrapSelection('**')"><strong>B</strong></button>
      <button type="button" class="toolbar-btn" title="Italic" @click="wrapSelection('*')"><em>I</em></button>
      <button type="button" class="toolbar-btn toolbar-strikethrough" title="Strikethrough" @click="wrapSelection('~~')">S</button>
      <button type="button" class="toolbar-btn" title="Inline Code" @click="wrapSelection('`')"><code>`</code></button>
      <span class="toolbar-divider"></span>
      <button type="button" class="toolbar-btn" title="Bulleted List" @click="addBlock('bulleted-list')">•</button>
      <button type="button" class="toolbar-btn" title="Numbered List" @click="addBlock('numbered-list')">1.</button>
      <button type="button" class="toolbar-btn" title="To-do" @click="addBlock('todo')">☑</button>
      <span class="toolbar-divider"></span>
      <button type="button" class="toolbar-btn" title="Quote" @click="addBlock('quote')">❝</button>
      <button type="button" class="toolbar-btn" title="Code Block" @click="addBlock('code')">💻</button>
      <button type="button" class="toolbar-btn" title="Callout" @click="addBlock('callout')">💡</button>
      <button type="button" class="toolbar-btn" title="Divider" @click="addBlock('divider')">—</button>
      <span class="toolbar-divider"></span>
      <button type="button" class="toolbar-btn" title="Image" @click="addBlock('image')">🖼️</button>
      <button type="button" class="toolbar-btn" title="Link" @click="insertLink">🔗</button>
      <button type="button" class="toolbar-btn" title="Table" @click="addBlock('table')">▦</button>
    </div>

    <div class="editor-wrapper" ref="editorWrapper">
      <div class="blocks-list">
        <template v-for="(block, index) in blocks" :key="block.id">
          
          <!-- Row Block -->
          <div v-if="block.type === 'row'" class="block-row">
            <div 
              v-for="(col, colIndex) in block.children" 
              :key="col.id" 
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
                  @reorder="handleReorder"
                >
                  <ContentBlock
                    v-model="childBlock.content"
                    :class="childBlock.type"
                    :placeholder="getPlaceholder(childBlock.type)"
                    @enter="handleEnter(childBlock.id, col.id)"
                    @backspace="handleBackspace(childBlock.id, col.id)"
                    @slash="handleSlash($event, childBlock.id)"
                    @double-colon="handleDoubleColon($event, childBlock.id)"
                  />
                </EditorBlock>
              </div>

              <!-- Empty Column Drop Zone -->
              <div 
                v-if="!col.children || col.children.length === 0" 
                class="empty-column-drop-zone"
                @dragover.prevent
                @drop="handleDropInEmptyColumn(col.id, $event)"
              >
                Drop here
              </div>
            </div>
          </div>

          <!-- Standard Block -->
          <EditorBlock
            v-else
            :blockId="block.id"
            :index="index"
            @reorder="handleReorder"
          >
            <ContentBlock
              v-model="block.content"
              :class="block.type"
              :placeholder="getPlaceholder(block.type)"
              @enter="handleEnter(block.id)"
              @backspace="handleBackspace(block.id)"
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
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick, computed } from 'vue'
import EditorBlock from './blocks/EditorBlock.vue'
import ContentBlock from './blocks/ContentBlock.vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])

// --- Types ---
interface Block {
  id: string
  type: 'paragraph' | 'heading-1' | 'heading-2' | 'heading-3' | 'heading-4' | 'heading-5' | 'heading-6' | 
        'callout' | 'row' | 'column' | 'quote' | 'code' | 'bulleted-list' | 'numbered-list' | 
        'todo' | 'divider' | 'image' | 'table'
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
const editorWrapper = ref<HTMLElement | null>(null)

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
  { label: 'Table', desc: 'Insert a table', icon: '▦', type: 'table' }
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
  // Embeds
  { label: 'YouTube', desc: 'Embed YouTube video', icon: '▶️', action: 'youtube' },
  { label: 'Tweet', desc: 'Embed a tweet', icon: '🐦', action: 'tweet' },
  { label: 'CodePen', desc: 'Embed CodePen', icon: '✏️', action: 'codepen' },
  { label: 'GitHub Gist', desc: 'Embed a gist', icon: '📋', action: 'gist' }
]

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
    
    // Headings (if passed as HTML)
    if (['H1', 'H2', 'H3'].includes(el.tagName)) {
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

const handleEnter = (blockId: string, parentId?: string) => {
  if (showSlashMenu.value) {
    executeCommand(filteredCommands.value[selectedCommandIndex.value])
    return
  }
  
  const path = findBlockPath(blockId, blocks.value)
  if (path) {
    const { list, index } = path[path.length - 1]
    const newBlock: Block = {
      id: generateId(),
      type: 'paragraph',
      content: ''
    }
    list.splice(index + 1, 0, newBlock)
    
    // Focus the new block after it's rendered
    nextTick(() => {
      if (typeof document === 'undefined') return
      
      // Find all contenteditable elements
      const editables = document.querySelectorAll('.content-block-input')
      // Calculate which editable corresponds to our new block
      // This is a simplified approach - in production we'd use refs
      let currentIndex = 0
      const targetIndex = index + 1
      
      // Count blocks recursively to find the right index
      const countBlocks = (blocksList: Block[]): number => {
        let count = 0
        for (const b of blocksList) {
          if (b.type === 'row' && b.children) {
            for (const col of b.children) {
              if (col.children) count += countBlocks(col.children)
            }
          } else if (b.type !== 'column') {
            count++
          }
        }
        return count
      }
      
      // Find the editable for newBlock.id
      editables.forEach((el) => {
        const parent = el.closest('[data-block-id]')
        // Since we just added it, it should be one of the later ones
      })
      
      // Simplified: just try to focus the next editable after current
      // This works for simple cases
      if (editables[targetIndex]) {
        (editables[targetIndex] as HTMLElement).focus()
      }
    })
  }
}

const handleBackspace = (blockId: string, parentId?: string) => {
  const path = findBlockPath(blockId, blocks.value)
  if (path) {
    const { list, index } = path[path.length - 1]
    const block = list[index]
    
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
      } else if (list.length === 1 && blocks.value.length > 1) {
        // If this is the only block in a nested list but there are other root blocks
        list.splice(index, 1)
      }
      // If it's the last block in the editor, keep it but don't delete
    }
  }
}

// --- Slash Menu ---
const handleSlash = (event: Event, blockId: string) => {
  if (typeof document === 'undefined') return
  
  const target = event.target as HTMLElement
  const rect = target.getBoundingClientRect()
  const wrapperRect = editorWrapper.value?.getBoundingClientRect() || { top: 0, left: 0 }
  const scrollTop = editorWrapper.value?.scrollTop || 0
  
  activeBlockId.value = blockId
  slashMenuPosition.value = {
    top: (rect.bottom - wrapperRect.top) + scrollTop + 5,
    left: (rect.left - wrapperRect.left)
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
const handleDoubleColon = (event: Event, blockId: string) => {
  if (typeof document === 'undefined') return
  
  const target = event.target as HTMLElement
  const rect = target.getBoundingClientRect()
  const wrapperRect = editorWrapper.value?.getBoundingClientRect() || { top: 0, left: 0 }
  const scrollTop = editorWrapper.value?.scrollTop || 0
  
  activeBlockId.value = blockId
  settingsMenuPosition.value = {
    top: (rect.bottom - wrapperRect.top) + scrollTop + 5,
    left: (rect.left - wrapperRect.left)
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
          const videoId = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/)?.[1]
          if (videoId) {
            block.content += `\n<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>\n`
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
const handleReorder = ({ draggedId, targetId, position }: { draggedId: string, targetId: string, position: string }) => {
  // 1. Find dragged block
  const draggedPath = findBlockPath(draggedId, blocks.value)
  if (!draggedPath) return
  
  const { list: sourceList, index: sourceIndex } = draggedPath[draggedPath.length - 1]
  const [draggedBlock] = sourceList.splice(sourceIndex, 1)
  
  // 2. Find target block
  const targetPath = findBlockPath(targetId, blocks.value)
  if (!targetPath) {
    sourceList.splice(sourceIndex, 0, draggedBlock) // Revert
    return
  }
  
  const { list: targetList, index: targetIndex } = targetPath[targetPath.length - 1]
  const targetBlock = targetList[targetIndex]
  
  // 3. Handle Drop
  if (position === 'top') {
    targetList.splice(targetIndex, 0, draggedBlock)
  } else if (position === 'bottom') {
    targetList.splice(targetIndex + 1, 0, draggedBlock)
  } else if (position === 'left' || position === 'right') {
    // N-Column Logic
    
    // Case A: Target is already inside a Column?
    // We need to check if we are dropping ON a column or ON a block inside a column.
    // The `targetId` is the block ID.
    
    // Check if target is inside a column (i.e. parent is a column)
    // We can check the path.
    const parentBlock = targetPath.length > 1 ? targetPath[targetPath.length - 2].list : null
    // Actually, `list` is the array, we need the block object.
    // Let's look at the parent structure.
    
    // Easier: Check if targetList is a child of a 'column' block.
    // But we don't have easy access to parent type here without traversing up.
    // However, if we are creating a split, we generally want to:
    // 1. If target is NOT in a Row: Create Row(Col(Target), Col(Dragged))
    // 2. If target IS in a Row (so it's inside a Col):
    //    - If we drop Left/Right, do we want to split THAT column? (Nested Row)
    //    - OR do we want to add a column to the PARENT Row?
    //    - Notion does: If you drop on the edge of a block in a column, it adds a column to the parent row.
    
    // Let's implement "Add Column to Parent Row" if possible, else "Create New Row".
    
    // We need to find the Parent Row if it exists.
    // In our structure: Row -> Column -> Block.
    // So if target is a Block, its parent list is Column.children.
    // The Column's parent list is Row.children.
    
    const isTargetInColumn = targetPath.length >= 2 
      // We can't easily verify type without looking up, but based on depth:
      // Depth 1: Root -> Block (Not in column)
      // Depth 2: Root -> Row -> Column (Not quite, Row has children=Columns)
      // Depth 3: Root -> Row -> Column -> Block (In column)
      
      // Let's assume depth check:
      // Path[0]: { list: blocks.value, index: ... } (Root)
      // Path[1]: { list: row.children, index: ... } (Column)
      // Path[2]: { list: col.children, index: ... } (Block)
      
    if (targetPath.length >= 3) {
      // Target is inside a Column.
      // We want to add a new Column to the Row (Path[1].list is the Row's children)
      const rowChildren = targetPath[targetPath.length - 2].list
      const colIndexInRow = targetPath[targetPath.length - 2].index
      
      // Insert new column
      const newCol: Block = {
        id: generateId(),
        type: 'column',
        content: '',
        children: [draggedBlock]
      }
      
      if (position === 'left') {
        rowChildren.splice(colIndexInRow, 0, newCol)
      } else {
        rowChildren.splice(colIndexInRow + 1, 0, newCol)
      }
    } else {
      // Target is at Root (or not in a column). Create new Row.
      const newRow: Block = {
        id: generateId(),
        type: 'row',
        content: '',
        children: [
          { 
            id: generateId(), 
            type: 'column', 
            content: '', 
            children: position === 'left' ? [draggedBlock] : [targetBlock] 
          },
          { 
            id: generateId(), 
            type: 'column', 
            content: '', 
            children: position === 'left' ? [targetBlock] : [draggedBlock] 
          }
        ]
      }
      targetList.splice(targetIndex, 1, newRow)
    }
  }
}

const handleDropInEmptyColumn = (colId: string, e: DragEvent) => {
  const data = e.dataTransfer?.getData('application/json')
  if (!data) return
  const { id: draggedId } = JSON.parse(data)
  
  const draggedPath = findBlockPath(draggedId, blocks.value)
  if (!draggedPath) return
  
  const { list: sourceList, index: sourceIndex } = draggedPath[draggedPath.length - 1]
  const [draggedBlock] = sourceList.splice(sourceIndex, 1)
  
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
    colBlock.children.push(draggedBlock)
  }
}

</script>

<style scoped>
.markdown-editor-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ffffff;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'SF Pro Display', sans-serif;
}

.editor-toolbar {
  display: flex;
  gap: 2px;
  padding: 8px 12px;
  border-bottom: 1px solid #e8e8e8;
  background: #fafafa;
  position: sticky;
  top: 0;
  z-index: 10;
}

.toolbar-btn {
  min-width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #6b7280;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s ease;
  padding: 0 8px;
}

.toolbar-btn:hover {
  background: #e5e7eb;
  color: #111827;
}

.toolbar-btn:active {
  background: #d1d5db;
  transform: scale(0.98);
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background: #e5e7eb;
  margin: 0 4px;
  align-self: center;
}

.editor-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  position: relative;
  background: #ffffff;
}

.editor-wrapper::-webkit-scrollbar {
  width: 8px;
}

.editor-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.editor-wrapper::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.editor-wrapper::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.blocks-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  width: 100%;
  max-width: 100%;
}

/* Block wrapper - full width */
.blocks-list > :deep(*) {
  width: 100%;
  max-width: 100%;
}

/* Typography */
.heading-1 { 
  font-size: 2.5em; 
  font-weight: 700; 
  margin-top: 0.8em;
  margin-bottom: 0.3em;
  line-height: 1.2;
  color: #111827;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
}

.heading-2 { 
  font-size: 1.875em; 
  font-weight: 700; 
  margin-top: 0.8em;
  margin-bottom: 0.3em;
  line-height: 1.3;
  color: #111827;
}

.heading-3 { 
  font-size: 1.5em; 
  font-weight: 600; 
  margin-top: 0.8em;
  margin-bottom: 0.3em;
  line-height: 1.4;
  color: #111827;
}

.paragraph { 
  font-size: 16px; 
  line-height: 1.75;
  color: #374151;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.callout { 
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding: 16px 20px;
  border-radius: 8px;
  border-left: 3px solid #3b82f6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.heading-4 {
  font-size: 1.25em;
  font-weight: 600;
  margin-top: 0.8em;
  margin-bottom: 0.3em;
  line-height: 1.4;
  color: #111827;
}

.heading-5 {
  font-size: 1.1em;
  font-weight: 600;
  margin-top: 0.8em;
  margin-bottom: 0.3em;
  line-height: 1.4;
  color: #374151;
}

.heading-6 {
  font-size: 1em;
  font-weight: 600;
  margin-top: 0.8em;
  margin-bottom: 0.3em;
  line-height: 1.4;
  color: #6b7280;
}

.quote {
  font-size: 1.1em;
  font-style: italic;
  color: #4b5563;
  border-left: 4px solid #d1d5db;
  padding-left: 16px;
  margin: 8px 0;
}

.code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  background: #1f2937;
  color: #e5e7eb;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  white-space: pre-wrap;
}

.bulleted-list,
.numbered-list {
  font-size: 16px;
  line-height: 1.75;
  color: #374151;
  padding-left: 8px;
}

.bulleted-list::before {
  content: '•';
  margin-right: 8px;
  color: #6b7280;
}

.numbered-list::before {
  content: '1.';
  margin-right: 8px;
  color: #6b7280;
}

.todo {
  font-size: 16px;
  line-height: 1.75;
  color: #374151;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.todo::before {
  content: '☐';
  font-size: 18px;
  color: #9ca3af;
}

.divider {
  border: none;
  border-top: 2px solid #e5e7eb;
  margin: 24px 0;
  height: 0;
  min-height: 0;
}

.image {
  max-width: 100%;
  border-radius: 8px;
  background: #f3f4f6;
  padding: 8px;
  text-align: center;
  color: #6b7280;
  font-style: italic;
}

.table {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  white-space: pre;
  background: #f9fafb;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  overflow-x: auto;
}

/* Layout */
.block-row {
  display: flex;
  gap: 24px;
  width: 100%;
  align-items: flex-start;
  margin: 8px 0;
}

.block-column {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px;
  border: 1px solid transparent;
  border-radius: 8px;
  transition: all 0.2s ease;
  position: relative;
  background: #fafafa;
}

.block-column:hover {
  border-color: #e5e7eb;
  background: #f9fafb;
}

.column-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 40px;
}

.empty-column-drop-zone {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 13px;
  border: 2px dashed #d1d5db;
  border-radius: 6px;
  margin-top: 8px;
  transition: all 0.2s ease;
  background: #fafafa;
}

.empty-column-drop-zone:hover {
  border-color: #3b82f6;
  background: #eff6ff;
  color: #3b82f6;
}

.empty-editor {
  padding: 60px 20px;
  color: #9ca3af;
  cursor: text;
  text-align: center;
  font-size: 16px;
}

/* Slash Menu */
.slash-menu {
  position: absolute;
  z-index: 100;
  width: 280px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05);
  max-height: 320px;
  overflow-y: auto;
  padding: 6px;
}

.menu-header {
  padding: 8px 12px 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: #6b7280;
  letter-spacing: 0.5px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.menu-item:hover, .menu-item.active {
  background: #f3f4f6;
}

.menu-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  flex-shrink: 0;
}

.menu-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.menu-label { 
  font-size: 14px; 
  font-weight: 500;
  color: #111827;
  line-height: 1.3;
}

.menu-desc { 
  font-size: 12px; 
  color: #6b7280;
  line-height: 1.3;
}

/* Settings Menu (::) */
.settings-menu {
  position: absolute;
  z-index: 100;
  width: 280px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05);
  max-height: 400px;
  overflow-y: auto;
  padding: 6px;
}
</style>
