import { prisma } from '@/infrastructure/database/prisma'
import { CreateUserData, UpdateUserData, UsersSearchParams, UserWithRelations } from '../types'
import { Prisma } from '@prisma/client'

export class UsersService {
  async create(data: CreateUserData): Promise<UserWithRelations> {
    const user = await prisma.user.create({
      data,
    })

    return user
  }

  async findMany(params: UsersSearchParams): Promise<{
    users: UserWithRelations[]
    total: number
    page: number
    limit: number
  }> {
    const {
      query,
      location,
      interests,
      page = 1,
      limit = 20,
    } = params

    const where: Prisma.UserWhereInput = {
      status: 'active',
    }

    if (query) {
      where.OR = [
        { displayName: { contains: query, mode: 'insensitive' } },
        { username: { contains: query, mode: 'insensitive' } },
        { bio: { contains: query, mode: 'insensitive' } },
      ]
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' }
    }

    if (interests && interests.length > 0) {
      where.interests = {
        hasSome: interests,
      }
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
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
            take: 5,
          },
          businesses: {
            select: {
              id: true,
              displayName: true,
              slug: true,
            },
            where: {
              status: 'published',
            },
            take: 5,
          },
          communities: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
            where: {
              status: 'published',
            },
            take: 5,
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ])

    return {
      users,
      total,
      page,
      limit,
    }
  }

  async findByUid(uid: string): Promise<UserWithRelations | null> {
    return prisma.user.findUnique({
      where: { uid },
      include: {
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
        businesses: {
          select: {
            id: true,
            displayName: true,
            slug: true,
          },
          where: {
            status: 'published',
          },
          take: 10,
        },
        communities: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
          where: {
            status: 'published',
          },
          take: 10,
        },
      },
    })
  }

  async findByUsername(username: string): Promise<UserWithRelations | null> {
    return prisma.user.findUnique({
      where: { username },
      include: {
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
        businesses: {
          select: {
            id: true,
            displayName: true,
            slug: true,
          },
          where: {
            status: 'published',
          },
          take: 10,
        },
        communities: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
          where: {
            status: 'published',
          },
          take: 10,
        },
      },
    })
  }

  async findById(id: string): Promise<UserWithRelations | null> {
    return prisma.user.findUnique({
      where: { id },
      include: {
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
        businesses: {
          select: {
            id: true,
            displayName: true,
            slug: true,
          },
          where: {
            status: 'published',
          },
          take: 10,
        },
        communities: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
          where: {
            status: 'published',
          },
          take: 10,
        },
      },
    })
  }

  async update(id: string, data: UpdateUserData): Promise<UserWithRelations> {
    return prisma.user.update({
      where: { id },
      data,
      include: {
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
        businesses: {
          select: {
            id: true,
            displayName: true,
            slug: true,
          },
          where: {
            status: 'published',
          },
          take: 10,
        },
        communities: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
          where: {
            status: 'published',
          },
          take: 10,
        },
      },
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    })
  }

  async updatePoints(id: string, points: number): Promise<UserWithRelations> {
    return prisma.user.update({
      where: { id },
      data: {
        points: {
          increment: points,
        },
      },
    })
  }
}