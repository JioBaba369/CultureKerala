import { Business } from '@prisma/client'

export interface BusinessWithRelations extends Business {
  owner?: {
    id: string
    displayName: string
    username: string
  }
  events?: {
    id: string
    title: string
    slug: string
    startsAt: Date
  }[]
  deals?: {
    id: string
    title: string
    slug: string
    startsAt: Date
    endsAt: Date
  }[]
}

export interface CreateBusinessData {
  ownerId: string
  displayName: string
  slug: string
  description?: string
  category: string
  addresses: string[]
  cities: string[]
  isOnline?: boolean
  email?: string
  phone?: string
  website?: string
  facebook?: string
  instagram?: string
  x?: string
  linkedin?: string
  images?: string[]
  logoURL?: string
}

export interface BusinessesSearchParams {
  query?: string
  city?: string
  category?: string
  verified?: boolean
  isOnline?: boolean
  page?: number
  limit?: number
}