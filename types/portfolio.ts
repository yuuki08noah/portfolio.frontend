export interface PortfolioProject {
  id: string
  slug: string
  title: string
  description: string
  itinerary?: string[]
  souvenirs?: string[]
  stack: string[]
  links: {
    demo?: string
    repo?: string
  }
  coverImage?: string
  start_date?: string
  end_date?: string
  is_ongoing?: boolean
  created_at?: string
  updated_at?: string
}

export interface Award {
  id: string
  title: string
  organization: string
  date: string
  description?: string
  badge?: string
}

export interface Certification {
  id?: string
  name: string
  issuer?: string
  date?: string
  url?: string
  kind?: string
}

export interface Milestone {
  id: string
  type: 'work' | 'education'
  title: string
  organization: string
  period: string
  details: string[]
  location?: string
}

export interface HireRequest {
  name: string
  company?: string
  email: string
  message?: string
  scheduleISO: string
}

export interface ProjectBlogPost {
  id: string
  projectId: string
  category: 'overview' | 'troubleshooting' | 'technical' | 'devlog' | 'references'
  title: string
  slug: string
  content: string
  order: number
  velogUrl?: string
  velogPostId?: string
  velogStats?: {
    likes: number
    comments: number
    views: number
    lastSyncedAt: string
  }
  createdAt: string
  updatedAt: string
}
