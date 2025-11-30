export interface TravelDiaryTranslations {
  ko?: {
    title?: string
    description?: string
  }
  ja?: {
    title?: string
    description?: string
  }
}

export interface TravelDiary {
  id: string
  destination: {
    country: string
    city: string
    countryCode: string
  }
  startDate: string
  endDate: string
  title: string
  description?: string
  days: TravelDay[]
  photos: string[]
  rating?: number
  expenses?: TravelExpense
  companions?: string[]
  tags?: string[]
  isPublic: boolean
  translations?: TravelDiaryTranslations
}

export interface TravelDay {
  id: string
  date: string
  title: string
  content: string
  photos?: string[]
  locations?: Location[]
  activities?: string[]
}

export interface Location {
  name: string
  lat?: number
  lng?: number
  address?: string
  category?: string
}

export interface TravelExpense {
  total: number
  currency: string
  breakdown?: {
    accommodation?: number
    food?: number
    transportation?: number
    activities?: number
    shopping?: number
    other?: number
  }
}

export interface TravelPlanTranslations {
  ko?: {
    destination_city?: string
    destination_country?: string
    notes?: string
  }
  ja?: {
    destination_city?: string
    destination_country?: string
    notes?: string
  }
}

export interface TravelPlan {
  id: string
  destination: {
    country: string
    city: string
    countryCode: string
  }
  targetDate?: string
  duration?: number
  budget?: {
    amount: number
    currency: string
  }
  status: 'planning' | 'booked' | 'completed' | 'cancelled'
  checklist: ChecklistItem[]
  bucketList: string[]
  itinerary?: ItineraryDay[]
  timeSlotDuration: number
  notes?: string
  translations?: TravelPlanTranslations
}

export interface ChecklistItem {
  id: string
  task: string
  completed: boolean
  dueDate?: string
  category: 'document' | 'booking' | 'packing' | 'other'
}

export interface ItineraryDay {
  day: number
  date?: string
  activities: ItineraryActivity[]
}

export interface ItineraryActivity {
  id: string
  startTime: string
  endTime: string
  activity: string
  location?: string
  description?: string
  category?: 'transportation' | 'meal' | 'sightseeing' | 'accommodation' | 'other'
  color?: string
  cost?: number
}
