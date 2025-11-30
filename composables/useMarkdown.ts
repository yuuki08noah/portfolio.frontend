export const useMarkdown = () => {
  const renderMarkdown = (markdown: string): string => {
    const escapeHtml = (str: string) =>
      str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')

    let html = escapeHtml(markdown)

    html = html.replace(/^### (.*)$/gim, '<h3>$1</h3>')
    html = html.replace(/^## (.*)$/gim, '<h2>$1</h2>')
    html = html.replace(/^# (.*)$/gim, '<h1>$1</h1>')
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>')
    html = html.replace(/`(.*?)`/gim, '<code>$1</code>')
    html = html.replace(/\n\-(.*)/gim, '<ul><li>$1</li></ul>')
    html = html.replace(/\n\d\.(.*)/gim, '<ol><li>$1</li></ol>')
    html = html.replace(/\n{2,}/g, '</p><p>')

    return `<p>${html}</p>`
  }

  const extractToc = (markdown: string) => {
    const headingRegex = /^#{1,6}\s+(.+)$/gm
    const toc: Array<{ level: number; text: string; id: string }> = []
    let match

    while ((match = headingRegex.exec(markdown)) !== null) {
      const level = match[0].indexOf(' ')
      const text = match[1]
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
