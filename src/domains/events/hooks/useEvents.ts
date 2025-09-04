import { useQuery } from '@tanstack/react-query'
import { EventsService } from '../services/EventsService'
import { EventsSearchParams } from '../types'

const eventsService = new EventsService()

export function useEvents(params: EventsSearchParams) {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => eventsService.findMany(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useEvent(slug: string) {
  return useQuery({
    queryKey: ['event', slug],
    queryFn: () => eventsService.findBySlug(slug),
    staleTime: 5 * 60 * 1000,
    enabled: !!slug,
  })
}