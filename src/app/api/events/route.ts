import { NextRequest, NextResponse } from 'next/server'
import { EventsService } from '@/domains/events/services/EventsService'
import { CreateEventData } from '@/domains/events/types'
import { z } from 'zod'

const eventsService = new EventsService()

// Schema for validating event creation
const createEventSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(100),
  summary: z.string().optional(),
  organizer: z.string().min(1),
  communityId: z.string().optional(),
  businessId: z.string().optional(),
  startsAt: z.string().transform((str) => new Date(str)),
  endsAt: z.string().transform((str) => new Date(str)),
  timezone: z.string().min(1),
  isOnline: z.boolean().optional(),
  venueName: z.string().optional(),
  venueAddress: z.string().optional(),
  venueCity: z.string().optional(),
  gmapsUrl: z.string().url().optional(),
  meetingLink: z.string().url().optional(),
  coverURL: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  ticketingType: z.string().optional(),
  priceMin: z.number().optional(),
  externalUrl: z.string().url().optional(),
  capacity: z.number().positive().optional(),
  visibility: z.enum(['public', 'unlisted']).optional(),
  createdBy: z.string().min(1),
})

// Schema for validating search params
const searchParamsSchema = z.object({
  query: z.string().optional(),
  city: z.string().optional(),
  category: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  isOnline: z.string().transform((val) => val === 'true').optional(),
  page: z.string().transform((val) => parseInt(val, 10)).optional(),
  limit: z.string().transform((val) => parseInt(val, 10)).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams.entries())
    
    const validatedParams = searchParamsSchema.parse(params)
    
    const result = await eventsService.findMany(validatedParams)
    
    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Events API Error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid search parameters',
          details: error.errors,
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const validatedData = createEventSchema.parse(body)
    
    const event = await eventsService.create(validatedData as CreateEventData)
    
    return NextResponse.json({
      success: true,
      data: event,
    }, { status: 201 })
  } catch (error) {
    console.error('Events API Error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid event data',
          details: error.errors,
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}