import type {
  BlogPost,
  Category,
  Tag,
  ProjectDocument,
  Book,
  ReadingGoal,
  TravelDiary,
  TravelPlan,
  ItineraryActivity
} from '~/types'

export const blogPosts: BlogPost[] = [
  {
    id: 'post-journey-portfolio',
    authorId: 'author-noah',
    title: 'Building a Travel-Themed Portfolio with Nuxt 3',
    subtitle: 'How “A Journey to Myself” became my design north star',
    slug: 'travel-themed-portfolio',
    content: `
## Why a Journey Theme?
Framing the portfolio as a voyage keeps every section coherent — Traveler Profile, Milestones, Destinations, and the Compass of external links.

## What I built
- Country/City theming with persisted selection
- Destination cards that read like itineraries
- A Book an Interview (Hire Me) flow wired to SMTP
- Project docs mapped to Velog-style stats

## Lessons learned
- Lean Nuxt data fetching keeps pages responsive even with mock data.
- Clear PRD artifacts speed up implementation decisions.
    `,
    excerpt: 'How I shaped the Nuxt 3 front-end around a travel narrative and Velog-style docs.',
    coverImage: 'https://images.unsplash.com/photo-1502920514313-52581002a659?auto=format&fit=crop&w=1200&q=80',
    tags: ['nuxt', 'portfolio', 'design-system'],
    category: 'portfolio',
    status: 'published',
    publishedAt: '2024-12-15T00:00:00.000Z',
    scheduledAt: undefined,
    isPublic: true,
    views: 1280,
    createdAt: '2024-12-10T00:00:00.000Z',
    updatedAt: '2024-12-20T00:00:00.000Z'
  },
  {
    id: 'post-reading-stack',
    authorId: 'author-noah',
    title: 'Designing a Reading Tracker as Mini Journeys',
    subtitle: 'Book cards, stats, and notes without backend friction',
    slug: 'reading-tracker-design',
    content: `
## Dashboard
Surface the basics: total books, currently reading, and this year's completions.

## Notes and quotes
Markdown notes plus quick quote capture keeps highlights close to the book.

## Goals
A single progress bar per year avoids overwhelming users while hinting at pace.
    `,
    excerpt: 'UI patterns that make reading feel like small trips with clear milestones.',
    coverImage: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
    tags: ['reading', 'ui', 'vue'],
    category: 'reading',
    status: 'published',
    publishedAt: '2025-01-05T00:00:00.000Z',
    scheduledAt: undefined,
    isPublic: true,
    views: 860,
    createdAt: '2025-01-03T00:00:00.000Z',
    updatedAt: '2025-01-06T00:00:00.000Z'
  },
  {
    id: 'post-travel-itinerary',
    authorId: 'author-noah',
    title: 'Time-Slot Itineraries without Drag-and-Drop Libraries',
    subtitle: 'Balancing structure and simplicity for travel planning',
    slug: 'time-slot-itinerary',
    content: `
## Slot durations
Support 15/30/60 minute slots and keep activities compact on mobile.

## Conflict awareness
Even a lightweight check prevents overlapping activities from confusing users.

## Visual language
Use badges and color-coding by category (transport, meal, sightseeing, stay).
    `,
    excerpt: 'A lightweight approach to itinerary timelines that still feels guided.',
    coverImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    tags: ['travel', 'nuxt', 'ux'],
    category: 'travel',
    status: 'published',
    publishedAt: '2025-01-10T00:00:00.000Z',
    scheduledAt: undefined,
    isPublic: true,
    views: 540,
    createdAt: '2025-01-08T00:00:00.000Z',
    updatedAt: '2025-01-10T00:00:00.000Z'
  }
]

export const blogCategories: Category[] = [
  { id: 'portfolio', name: 'Portfolio', slug: 'portfolio', description: 'Case studies and project docs', color: '#0ea5e9', icon: '🧭', postCount: 1, parentId: undefined },
  { id: 'reading', name: 'Reading', slug: 'reading', description: 'Books, notes, and goals', color: '#f59e0b', icon: '📚', postCount: 1, parentId: undefined },
  { id: 'travel', name: 'Travel', slug: 'travel', description: 'Itineraries and lessons', color: '#10b981', icon: '✈️', postCount: 1, parentId: undefined }
]

export const blogTags: Tag[] = [
  { id: 'nuxt', name: 'Nuxt', slug: 'nuxt', postCount: 2, usageCount: 2 },
  { id: 'portfolio', name: 'Portfolio', slug: 'portfolio', postCount: 1, usageCount: 1 },
  { id: 'reading', name: 'Reading', slug: 'reading', postCount: 1, usageCount: 1 },
  { id: 'ux', name: 'UX', slug: 'ux', postCount: 1, usageCount: 1 }
]

export const projectDocuments: Record<string, ProjectDocument[]> = {
  'aurora-tracker': [
    {
      id: 'aurora-overview',
      projectId: 'aurora-tracker',
      category: 'overview',
      title: 'Aurora Tracker Overview',
      slug: 'overview',
      content: `## Goal
Monitor northern lights conditions with live data and alerts.`,
      order: 1,
      isPublished: true,
      velogUrl: 'https://velog.io/@noah/aurora-overview',
      velogPostId: 'velog-aurora-1',
      createdAt: '2024-12-01T00:00:00.000Z',
      updatedAt: '2024-12-05T00:00:00.000Z'
    },
    {
      id: 'aurora-troubleshooting',
      projectId: 'aurora-tracker',
      category: 'troubleshooting',
      title: 'Realtime Stream Backpressure',
      slug: 'backpressure',
      content: `### Issue
Overflow when solar wind data spikes.

### Fix
Buffered updates and debounced chart renders.`,
      order: 2,
      isPublished: true,
      velogUrl: 'https://velog.io/@noah/aurora-backpressure',
      velogPostId: 'velog-aurora-2',
      createdAt: '2024-12-02T00:00:00.000Z',
      updatedAt: '2024-12-06T00:00:00.000Z'
    },
    {
      id: 'aurora-technical',
      projectId: 'aurora-tracker',
      category: 'technical',
      title: 'Stack & Deployment Notes',
      slug: 'stack',
      content: `- Nuxt 3 front
- Rails API + Sidekiq for alerts
- Mapbox for geomapping`,
      order: 3,
      isPublished: true,
      createdAt: '2024-12-03T00:00:00.000Z',
      updatedAt: '2024-12-06T00:00:00.000Z'
    },
    {
      id: 'aurora-devlog',
      projectId: 'aurora-tracker',
      category: 'devlog',
      title: 'Week 02 — Tuning the Scheduler',
      slug: 'week-02',
      content: `Refined cron cadence, added Velog stats poller.`,
      order: 4,
      isPublished: true,
      createdAt: '2024-12-07T00:00:00.000Z',
      updatedAt: '2024-12-07T00:00:00.000Z'
    }
  ],
  'globe-notes': [
    {
      id: 'globe-overview',
      projectId: 'globe-notes',
      category: 'overview',
      title: 'Globe Notes Overview',
      slug: 'overview',
      content: `Travel + reading mashup: geotag notes per city with markdown.`,
      order: 1,
      isPublished: true,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-02T00:00:00.000Z'
    },
    {
      id: 'globe-technical',
      projectId: 'globe-notes',
      category: 'technical',
      title: 'Offline-First Sync',
      slug: 'offline-first',
      content: `IndexedDB cache, optimistic UI, reconcile on reconnect.`,
      order: 2,
      isPublished: true,
      createdAt: '2025-01-03T00:00:00.000Z',
      updatedAt: '2025-01-04T00:00:00.000Z'
    }
  ]
}

export const readingBooks: Book[] = [
  {
    id: 'book-clean-architecture',
    title: 'Clean Architecture',
    author: 'Robert C. Martin',
    publisher: 'Pearson',
    status: 'reading',
    startDate: '2025-01-02',
    rating: 4.5,
    review: 'A reliable compass for structuring services and UI layers.',
    coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
    category: ['Software', 'Architecture'],
    pages: 432
  },
  {
    id: 'book-norwegian-wood',
    title: 'Norwegian Wood',
    author: 'Haruki Murakami',
    status: 'completed',
    startDate: '2024-12-10',
    endDate: '2024-12-20',
    rating: 4.8,
    review: 'Gentle pacing that reminds me to design calmer UIs.',
    coverImage: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80',
    category: ['Fiction'],
    pages: 296
  },
  {
    id: 'book-atomic-habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    status: 'completed',
    startDate: '2024-11-05',
    endDate: '2024-11-14',
    rating: 4.7,
    review: 'The “2-minute rule” maps well to starting commits and docs.',
    coverImage: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80',
    category: ['Productivity', 'Non-fiction'],
    pages: 320
  },
  {
    id: 'book-mountain-shadow',
    title: 'The Mountain Shadow',
    author: 'Gregory David Roberts',
    status: 'to-read',
    coverImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
    category: ['Adventure'],
    pages: 880
  }
]

export const readingGoals: ReadingGoal[] = [
  { id: 'goal-2025', year: 2025, targetBooks: 20, currentBooks: 2, progress: 10 },
  { id: 'goal-2024', year: 2024, targetBooks: 18, currentBooks: 16, progress: 89 }
]

export const readingStats = {
  booksThisYear: 2,
  totalBooks: 18,
  averageRating: 4.3,
  favoriteAuthor: 'Haruki Murakami',
  categoryDistribution: {
    Fiction: 6,
    Software: 5,
    Productivity: 3,
    Adventure: 2,
    Essays: 2
  },
  monthlyReading: {
    '2024-11': 3,
    '2024-12': 4,
    '2025-01': 2
  }
}

export const travelDiaries: TravelDiary[] = [
  {
    id: 'diary-kyoto',
    destination: { country: 'Japan', city: 'Kyoto', countryCode: 'JP' },
    startDate: '2024-10-03',
    endDate: '2024-10-08',
    title: 'Autumn in Kyoto',
    description: 'Temples, cafés, and quiet alleys during peak foliage.',
    days: [
      {
        id: 'd1',
        date: '2024-10-03',
        title: 'Arrival & Evening Walk',
        content: 'Checked in near Gion, sunset at Kiyomizu-dera.',
        photos: [],
        locations: [{ name: 'Kiyomizu-dera' }],
        activities: ['Check-in', 'Temple visit', 'Matcha tasting']
      },
      {
        id: 'd2',
        date: '2024-10-04',
        title: 'Arashiyama Day',
        content: 'Bamboo grove at dawn, river walk, tofu dinner.',
        photos: [],
        locations: [{ name: 'Arashiyama Bamboo Grove' }],
        activities: ['Sunrise walk', 'River boat', 'Food tour']
      }
    ],
    photos: [
      'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 5,
    expenses: {
      total: 950,
      currency: 'USD',
      breakdown: {
        accommodation: 400,
        food: 200,
        transportation: 150,
        activities: 120,
        other: 80
      }
    },
    companions: ['Solo'],
    tags: ['fall', 'temples'],
    isPublic: true
  },
  {
    id: 'diary-lisbon',
    destination: { country: 'Portugal', city: 'Lisbon', countryCode: 'PT' },
    startDate: '2024-07-12',
    endDate: '2024-07-16',
    title: 'Lisbon Light & Hills',
    description: 'Tiles, trams, and code from sunny cafés.',
    days: [],
    photos: ['https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80'],
    rating: 4.5,
    expenses: { total: 780, currency: 'USD' },
    companions: ['Friend'],
    tags: ['city', 'cafe'],
    isPublic: true
  }
]

export const travelPlans: TravelPlan[] = [
  {
    id: 'plan-kyoto',
    destination: { country: 'Japan', city: 'Kyoto', countryCode: 'JP' },
    targetDate: '2025-03-15',
    duration: 5,
    budget: { amount: 1200, currency: 'USD' },
    status: 'planning',
    checklist: [
      { id: 'visa', task: 'Check visa/ESTA', completed: true, category: 'document' },
      { id: 'flight', task: 'Book flights', completed: false, category: 'booking', dueDate: '2025-02-01' },
      { id: 'stay', task: 'Reserve machiya stay', completed: false, category: 'booking' },
      { id: 'packing', task: 'Pack light layers', completed: false, category: 'packing' }
    ],
    bucketList: ['Fushimi Inari sunrise', 'Tea ceremony', 'Cycling along Kamogawa'],
    itinerary: [
      {
        day: 1,
        date: '2025-03-15',
        activities: [
          { id: 'a1', startTime: '09:00', endTime: '10:00', activity: 'Arrive & drop bags', location: 'Kyoto Station', category: 'transportation', color: '#3b82f6' },
          { id: 'a2', startTime: '12:00', endTime: '13:30', activity: 'Lunch at Nishiki', location: 'Nishiki Market', category: 'meal', color: '#f97316' },
          { id: 'a3', startTime: '15:00', endTime: '17:00', activity: 'Philosopher’s Path walk', location: 'Higashiyama', category: 'sightseeing', color: '#22c55e' }
        ]
      }
    ],
    timeSlotDuration: 30,
    notes: 'Try to keep evenings light to adjust jet lag.'
  },
  {
    id: 'plan-porto',
    destination: { country: 'Portugal', city: 'Porto', countryCode: 'PT' },
    targetDate: '2025-05-10',
    duration: 4,
    budget: { amount: 900, currency: 'EUR' },
    status: 'booked',
    checklist: [
      { id: 'train', task: 'Train from Lisbon', completed: true, category: 'booking' },
      { id: 'cell', task: 'eSIM setup', completed: true, category: 'other' }
    ],
    bucketList: ['Ribeira sunset', 'Port tasting', 'Livraria Lello'],
    itinerary: [],
    timeSlotDuration: 30,
    notes: 'Find a day trip to Douro Valley.'
  }
]

export const itineraryActivities: Record<string, ItineraryActivity[]> = {
  'plan-kyoto': [
    { id: 'a1', startTime: '09:00', endTime: '10:00', activity: 'Arrive & drop bags', location: 'Kyoto Station', category: 'transportation', color: '#3b82f6' },
    { id: 'a2', startTime: '12:00', endTime: '13:30', activity: 'Lunch at Nishiki', location: 'Nishiki Market', category: 'meal', color: '#f97316' },
    { id: 'a3', startTime: '15:00', endTime: '17:00', activity: 'Philosopher’s Path walk', location: 'Higashiyama', category: 'sightseeing', color: '#22c55e' }
  ],
  'plan-porto': [
    { id: 'p1', startTime: '10:00', endTime: '12:00', activity: 'Ribeira walk', location: 'Ribeira', category: 'sightseeing', color: '#22c55e' },
    { id: 'p2', startTime: '14:00', endTime: '16:00', activity: 'Port lodge tour', location: 'Vila Nova de Gaia', category: 'other', color: '#94a3b8' }
  ]
}
