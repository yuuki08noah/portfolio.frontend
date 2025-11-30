export interface BlogPost {
  id: string
  authorId: string
  title: string
  subtitle?: string
  slug: string
  content: string
  excerpt?: string
  coverImage?: string
  tags: string[]
  category?: string
  status: 'draft' | 'published' | 'archived'
  publishedAt?: string
  scheduledAt?: string
  isPublic: boolean
  views: number
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  icon?: string
  parentId?: string
  postCount: number
}

export interface Tag {
  id: string
  name: string
  slug: string
  postCount: number
  usageCount: number
}

export interface ProjectBlog {
  projectId: string
  projectSlug: string
  documents: ProjectDocument[]
  velogIntegration?: VelogIntegration
}

export interface ProjectDocument {
  id: string
  projectId: string
  category: 'overview' | 'troubleshooting' | 'technical' | 'devlog' | 'references'
  title: string
  slug: string
  content: string
  order: number
  isPublished: boolean
  velogUrl?: string
  velogPostId?: string
  createdAt: string
  updatedAt: string
}

export interface VelogIntegration {
  username: string
  posts: VelogPost[]
}

export interface VelogPost {
  documentId: string
  velogPostId: string
  velogUrl: string
  title: string
  likes: number
  comments: number
  views?: number
  lastSyncedAt: string
}

export interface DocumentVelogStats {
  documentId: string
  velogUrl: string
  likes: number
  comments: number
  views: number
  lastFetchedAt: string
  isSynced: boolean
}
