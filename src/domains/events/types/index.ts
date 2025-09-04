import { Event } from '@prisma/client'

export interface EventWithRelations extends Event {
  creator?: {
    id: string
    displayName: string
    username: string
  }
  community?: {
    id: string
    name: string
    slug: string
  }
  business?: {
    id: string
    displayName: string
    slug: string
  }
}

export interface CreateEventData {
  title: string
  slug: string
  summary?: string
  organizer: string
  communityId?: string
  businessId?: string
  startsAt: Date
  endsAt: Date
  timezone: string
  isOnline?: boolean
  venueName?: string
  venueAddress?: string
  venueCity?: string
  gmapsUrl?: string
  meetingLink?: string
  coverURL?: string
  tags?: string[]
  ticketingType?: string
  priceMin?: number
  externalUrl?: string
  capacity?: number
  visibility?: string
  createdBy: string
}

export interface EventsSearchParams {
  query?: string
  city?: string
  category?: string
  dateFrom?: string
  dateTo?: string
  isOnline?: boolean
  page?: number
  limit?: number
}