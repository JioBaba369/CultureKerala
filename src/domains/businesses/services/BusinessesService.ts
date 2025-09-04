import { prisma } from '@/infrastructure/database/prisma'
import { CreateBusinessData, BusinessesSearchParams, BusinessWithRelations } from '../types'
import { Prisma } from '@prisma/client'

export class BusinessesService {
  async create(data: CreateBusinessData): Promise<BusinessWithRelations> {
    const business = await prisma.business.create({
      data,
      include: {
        owner: {
          select: {
            id: true,
            displayName: true,
            username: true,
          },
        },
      },
    })

    return business
  }

  async findMany(params: BusinessesSearchParams): Promise<{
    businesses: BusinessWithRelations[]
    total: number
    page: number
    limit: number
  }> {
    const {
      query,
      city,
      category,
      verified,
      isOnline,
      page = 1,
      limit = 20,
    } = params

    const where: Prisma.BusinessWhereInput = {
      status: 'published',
    }

    if (query) {
      where.OR = [
        { displayName: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ]
    }

    if (city) {
      where.cities = { has: city }
    }

    if (category) {
      where.category = category
    }

    if (verified !== undefined) {
      where.verified = verified
    }

    if (isOnline !== undefined) {
      where.isOnline = isOnline
    }

    const [businesses, total] = await Promise.all([
      prisma.business.findMany({
        where,
        include: {
          owner: {
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
          deals: {
            select: {
              id: true,
              title: true,
              slug: true,
              startsAt: true,
              endsAt: true,
            },
            where: {
              status: 'published',
              endsAt: {
                gte: new Date(),
              },
            },
            take: 5,
            orderBy: { startsAt: 'asc' },
          },
        },
        orderBy: [
          { verified: 'desc' },
          { createdAt: 'desc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.business.count({ where }),
    ])

    return {
      businesses,
      total,
      page,
      limit,
    }
  }

  async findBySlug(slug: string): Promise<BusinessWithRelations | null> {
    return prisma.business.findUnique({
      where: { slug },
      include: {
        owner: {
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
        deals: {
          select: {
            id: true,
            title: true,
            slug: true,
            startsAt: true,
            endsAt: true,
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

  async findById(id: string): Promise<BusinessWithRelations | null> {
    return prisma.business.findUnique({
      where: { id },
      include: {
        owner: {
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
        deals: {
          select: {
            id: true,
            title: true,
            slug: true,
            startsAt: true,
            endsAt: true,
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

  async update(id: string, data: Partial<CreateBusinessData>): Promise<BusinessWithRelations> {
    return prisma.business.update({
      where: { id },
      data,
      include: {
        owner: {
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
    await prisma.business.delete({
      where: { id },
    })
  }
}