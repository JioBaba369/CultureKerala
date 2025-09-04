import { Community } from '@prisma/client'

export interface CommunityWithRelations extends Community {
  creator?: {
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
}

export interface CreateCommunityData {
  name: string
  slug: string
  type: string
  description?: string
  logoURL?: string
  bannerURL?: string
  city: string
  country: string
  email?: string
  phone?: string
  website?: string
  facebook?: string
  instagram?: string
  x?: string
  youtube?: string
  owners: string[]
  admins?: string[]
  createdBy: string
}

export interface CommunitiesSearchParams {
  query?: string
  city?: string
  type?: string
  verified?: boolean
  page?: number
  limit?: number
}