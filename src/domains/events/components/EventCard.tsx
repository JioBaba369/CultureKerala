import { EventWithRelations } from '../types'
import Image from 'next/image'

interface EventCardProps {
  event: EventWithRelations
  className?: string
}

export function EventCard({ event, className }: EventCardProps) {
  return (
    <div className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${className}`}>
      {event.coverURL && (
        <Image 
          src={event.coverURL} 
          alt={event.title}
          width={400}
          height={200}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}
      
      <div className="space-y-2">
        <h3 className="font-semibold text-lg line-clamp-2">{event.title}</h3>
        
        {event.summary && (
          <p className="text-gray-600 text-sm line-clamp-3">{event.summary}</p>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{event.organizer}</span>
          <span>
            {new Date(event.startsAt).toLocaleDateString()}
          </span>
        </div>
        
        {event.venueCity && (
          <div className="text-sm text-gray-500">
            📍 {event.venueCity}
          </div>
        )}
        
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {event.tags.slice(0, 3).map((tag) => (
              <span 
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}