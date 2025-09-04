import { prisma } from '@/infrastructure/database/prisma'
import { CreateEventData, EventsSearchParams, EventWithRelations } from '../types'
import { Prisma } from '@prisma/client'

export class EventsService {
  async create(data: CreateEventData): Promise<EventWithRelations> {
    const event = await prisma.event.create({
      data,
      include: {
        creator: {
          select: {
            id: true,
            displayName: true,
            username: true,
          },
        },
        community: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        business: {
          select: {
            id: true,
            displayName: true,
            slug: true,
          },
        },
      },
    })

    return event
  }

  async findMany(params: EventsSearchParams): Promise<{
    events: EventWithRelations[]
    total: number
    page: number
    limit: number
  }> {
    const {
      query,
      city,
      category,
      dateFrom,
      dateTo,
      isOnline,
      page = 1,
      limit = 20,
    } = params

    const where: Prisma.EventWhereInput = {
      status: 'published',
      visibility: 'public',
    }

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { summary: { contains: query, mode: 'insensitive' } },
        { tags: { has: query } },
      ]
    }

    if (city) {
      where.venueCity = { contains: city, mode: 'insensitive' }
    }

    if (isOnline !== undefined) {
      where.isOnline = isOnline
    }

    if (dateFrom || dateTo) {
      where.startsAt = {}
      if (dateFrom) where.startsAt.gte = new Date(dateFrom)
      if (dateTo) where.startsAt.lte = new Date(dateTo)
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          creator: {
            select: {
              id: true,
              displayName: true,
              username: true,
            },
          },
          community: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          business: {
            select: {
              id: true,
              displayName: true,
              slug: true,
            },
          },
        },
        orderBy: { startsAt: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.event.count({ where }),
    ])

    return {
      events,
      total,
      page,
      limit,
    }
  }

  async findBySlug(slug: string): Promise<EventWithRelations | null> {
    return prisma.event.findUnique({
      where: { slug },
      include: {
        creator: {
          select: {
            id: true,
            displayName: true,
            username: true,
          },
        },
        community: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        business: {
          select: {
            id: true,
            displayName: true,
            slug: true,
          },
        },
      },
    })
  }

  async findById(id: string): Promise<EventWithRelations | null> {
    return prisma.event.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            displayName: true,
            username: true,
          },
        },
        community: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        business: {
          select: {
            id: true,
            displayName: true,
            slug: true,
          },
        },
      },
    })
  }

  async update(id: string, data: Partial<CreateEventData>): Promise<EventWithRelations> {
    return prisma.event.update({
      where: { id },
      data,
      include: {
        creator: {
          select: {
            id: true,
            displayName: true,
            username: true,
          },
        },
        community: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        business: {
          select: {
            id: true,
            displayName: true,
            slug: true,
          },
        },
      },
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.event.delete({
      where: { id },
    })
  }
}