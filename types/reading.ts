export interface BookTranslations {
  ko?: {
    title?: string
    author?: string
    review?: string
  }
  ja?: {
    title?: string
    author?: string
    review?: string
  }
}

export interface Book {
  id: string
  title: string
  author: string
  publisher?: string
  status: 'completed' | 'reading' | 'to-read'
  startDate?: string
  endDate?: string
  rating?: number
  review?: string
  coverImage?: string
  category?: string[]
  pages?: number
  translations?: BookTranslations
}

export interface ReadingNote {
  id: string
  bookId: string
  content: string
  quotes?: string[]
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface ReadingGoal {
  id: string
  year: number
  targetBooks: number
  currentBooks: number
  progress: number
}
