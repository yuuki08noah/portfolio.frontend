import { marked } from 'marked'

export const useMarkdown = () => {
  // Configure marked options
  marked.setOptions({
    breaks: false,
    gfm: true
  })

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

  const renderMarkdown = (markdown: string): string => {
    if (!markdown) return ''

    const slug = createSlugger()

    // For content with layout HTML (from our editor), preserve HTML and process markdown
    if (markdown.includes('layout-row') || markdown.includes('layout-col') || markdown.includes('layout-grid-2') || markdown.includes('callout')) {
      // Process the content but preserve HTML tags
      let html = markdown

      // Process markdown inside text blocks (not inside HTML tags)
      // Split by HTML tags and process text parts only
      const parts = html.split(/(<[^>]+>)/g)
      html = parts.map(part => {
        // If it's an HTML tag, keep it as-is
        if (part.startsWith('<')) return part
        // Otherwise, process as markdown using marked
        // We use parse but need to be careful about block wrapping if inside existing tags
        // For simplicity in this hybrid mode, let's use marked.parse which handles everything better than manual regex
        try {
          return marked.parse(part)
        } catch (e) {
          return part
        }
      }).join('')

      return html
    }

    // Use marked for full markdown processing
    try {
      let html = marked.parse(markdown) as string
      // Inject ids into headings for anchor support
      html = html.replace(/<h([1-6])>(.*?)<\/h\1>/g, (_, level, text) => {
        const cleanText = text.replace(/<[^>]+>/g, '')
        const id = slug(cleanText)
        return `<h${level} id="${id}">${text}</h${level}>`
      })
      return html
    } catch (e) {
      console.error('Markdown parsing error:', e)
      return markdown
    }
  }

  // Process inline markdown elements only (for mixed HTML/markdown content)
  const processInlineMarkdown = (text: string, slug: (text: string) => string): string => {
    if (!text.trim()) return text

    let html = text

    // Headings
    html = html.replace(/^######\s+(.*)$/gm, (_, t) => `<h6 id="${slug(t)}">${t}</h6>`)
    html = html.replace(/^#####\s+(.*)$/gm, (_, t) => `<h5 id="${slug(t)}">${t}</h5>`)
    html = html.replace(/^####\s+(.*)$/gm, (_, t) => `<h4 id="${slug(t)}">${t}</h4>`)
    html = html.replace(/^###\s+(.*)$/gm, (_, t) => `<h3 id="${slug(t)}">${t}</h3>`)
    html = html.replace(/^##\s+(.*)$/gm, (_, t) => `<h2 id="${slug(t)}">${t}</h2>`)
    html = html.replace(/^#\s+(.*)$/gm, (_, t) => `<h1 id="${slug(t)}">${t}</h1>`)

    // Code blocks
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre><code class="language-${lang || 'plaintext'}">${escapeHtml(code.trim())}</code></pre>`
    })

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

    // Bold & Italic
    html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>')
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')
    html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>')

    // Links & Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />')
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')

    // Horizontal rule
    html = html.replace(/^---$/gm, '<hr />')
    html = html.replace(/^\*\*\*$/gm, '<hr />')

    // Blockquotes
    html = html.replace(/^>\s+(.*)$/gm, '<blockquote>$1</blockquote>')

    // Lists
    html = html.replace(/^-\s+\[x\]\s+(.*)$/gm, '<li class="task-done"><input type="checkbox" checked disabled /> $1</li>')
    html = html.replace(/^-\s+\[\s?\]\s+(.*)$/gm, '<li class="task"><input type="checkbox" disabled /> $1</li>')
    html = html.replace(/^-\s+(.*)$/gm, '<li>$1</li>')
    html = html.replace(/^(\d+)\.\s+(.*)$/gm, '<li>$2</li>')

    // Wrap consecutive <li> in <ul> or <ol>
    html = html.replace(/(<li(?:\s+class="task(?:-done)?")?>.*?<\/li>\n?)+/g, (match) => {
      if (match.includes('class="task')) {
        return `<ul class="task-list">${match}</ul>`
      }
      return `<ul>${match}</ul>`
    })

    // Tables (basic support)
    html = html.replace(/\|(.+)\|\n\|[-:| ]+\|\n((?:\|.+\|\n?)+)/g, (_, header, body) => {
      const headers = header.split('|').filter((s: string) => s.trim()).map((s: string) => `<th>${s.trim()}</th>`).join('')
      const rows = body.trim().split('\n').map((row: string) => {
        const cells = row.split('|').filter((s: string) => s.trim()).map((s: string) => `<td>${s.trim()}</td>`).join('')
        return `<tr>${cells}</tr>`
      }).join('')
      return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`
    })

    // Line breaks (double space or single newline in paragraphs)
    html = html.replace(/\n\n/g, '</p><p>')

    return html
  }

  const escapeHtml = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')

  const extractToc = (markdown: string) => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm
    const toc: Array<{ level: number; text: string; id: string }> = []
    let match

    while ((match = headingRegex.exec(markdown)) !== null) {
      const level = match[1].length
      const text = match[2]
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')

      toc.push({ level, text, id })
    }

    return toc
  }

  const calculateReadingTime = (markdown: string): number => {
    const wordsPerMinute = 200
    const words = markdown.split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  return {
    renderMarkdown,
    extractToc,
    calculateReadingTime
  }
}
