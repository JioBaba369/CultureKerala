import { prisma } from '@/infrastructure/database/prisma'
import { CreateCommunityData, CommunitiesSearchParams, CommunityWithRelations } from '../types'
import { Prisma } from '@prisma/client'

export class GroupsService {
  async create(data: CreateCommunityData): Promise<CommunityWithRelations> {
    const community = await prisma.community.create({
      data,
      include: {
        creator: {
          select: {
            id: true,
            displayName: true,
            username: true,
          },
        },
      },
    })

    return community
  }

  async findMany(params: CommunitiesSearchParams): Promise<{
    communities: CommunityWithRelations[]
    total: number
    page: number
    limit: number
  }> {
    const {
      query,
      city,
      type,
      verified,
      page = 1,
      limit = 20,
    } = params

    const where: Prisma.CommunityWhereInput = {
      status: 'published',
    }

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ]
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' }
    }

    if (type) {
      where.type = type
    }

    if (verified !== undefined) {
      where.verified = verified
    }

    const [communities, total] = await Promise.all([
      prisma.community.findMany({
        where,
        include: {
          creator: {
            select: {
              id: true,
              displayName: true,
              username: true,
            },
          },
          events: {
            select: {
              id: true,
              title: true,
              slug: true,
              startsAt: true,
            },
            where: {
              status: 'published',
              startsAt: {
                gte: new Date(),
              },
            },
            take: 5,
            orderBy: { startsAt: 'asc' },
          },
        },
        orderBy: [
          { verified: 'desc' },
          { memberCount: 'desc' },
          { createdAt: 'desc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.community.count({ where }),
    ])

    return {
      communities,
      total,
      page,
      limit,
    }
  }

  async findBySlug(slug: string): Promise<CommunityWithRelations | null> {
    return prisma.community.findUnique({
      where: { slug },
      include: {
        creator: {
          select: {
            id: true,
            displayName: true,
            username: true,
          },
        },
        events: {
          select: {
            id: true,
            title: true,
            slug: true,
            startsAt: true,
          },
          where: {
            status: 'published',
          },
          orderBy: { startsAt: 'desc' },
          take: 10,
        },
      },
    })
  }

  async findById(id: string): Promise<CommunityWithRelations | null> {
    return prisma.community.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            displayName: true,
            username: true,
          },
        },
        events: {
          select: {
            id: true,
            title: true,
            slug: true,
            startsAt: true,
          },
          where: {
            status: 'published',
          },
          orderBy: { startsAt: 'desc' },
          take: 10,
        },
      },
    })
  }

  async update(id: string, data: Partial<CreateCommunityData>): Promise<CommunityWithRelations> {
    return prisma.community.update({
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
      },
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.community.delete({
      where: { id },
    })
  }
}