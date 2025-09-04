import { User } from '@prisma/client'

export interface UserWithRelations extends User {
  events?: {
    id: string
    title: string
    slug: string
    startsAt: Date
  }[]
  businesses?: {
    id: string
    displayName: string
    slug: string
  }[]
  communities?: {
    id: string
    name: string
    slug: string
  }[]
}

export interface CreateUserData {
  uid: string // Firebase Auth UID
  displayName: string
  email: string
  username: string
  bio?: string
  location?: string
  phone?: string
  photoURL?: string
  dob?: Date
  age?: number
  gender?: string
  interests?: string[]
  website?: string
  x?: string
  instagram?: string
  facebook?: string
  linkedin?: string
}

export interface UpdateUserData {
  displayName?: string
  bio?: string
  location?: string
  phone?: string
  photoURL?: string
  dob?: Date
  age?: number
  gender?: string
  interests?: string[]
  website?: string
  x?: string
  instagram?: string
  facebook?: string
  linkedin?: string
  hasCompletedOnboarding?: boolean
}

export interface UsersSearchParams {
  query?: string
  location?: string
  interests?: string[]
  page?: number
  limit?: number
}