
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Event, TicketTier } from '@/types';
import { Loader2, Minus, Plus, Ticket } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/firebase/auth';
import { createBooking } from '@/actions/booking-actions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from '../ui/label';


export function BookingDialog({
  event,
  children,
}: {
  event: Event;
  children: React.ReactNode;
}) {
  const [selectedTierId, setSelectedTierId] = useState<string | undefined>(event.ticketing?.tiers?.[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const selectedTier = event.ticketing?.tiers?.find(t => t.id === selectedTierId);
  const maxQuantity = selectedTier?.quantityAvailable || 10;
  
  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => Math.max(1, Math.min(maxQuantity, prev + amount)));
  };
  
  const totalPrice = (selectedTier?.price ?? 0) * quantity;

  const handleConfirmBooking = async () => {
    if (!user) {
      toast({ variant: "destructive", title: "Not Authenticated", description: "You need to be logged in to book tickets." });
      return;
    }
    if (!selectedTierId || !selectedTier) {
       toast({ variant: "destructive", title: "Selection Error", description: "Please select a valid ticket type." });
       return;
    }
    
    setIsBooking(true);
    try {
      await createBooking({
        eventId: event.id,
        eventTitle: event.title,
        userId: user.uid,
        ticketTypeId: selectedTierId,
        quantity,
        totalPrice,
      });

      toast({
        title: "Booking Confirmed!",
        description: `You've successfully booked ${quantity} ticket(s) for "${event.title}".`,
      });

    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Booking Failed",
        description: error.message || "There was a problem confirming your booking. Please try again.",
      });
    } finally {
      setIsBooking(false);
    }
  }

  return (
    <Dialog onOpenChange={() => setQuantity(1)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center gap-2">
            <Ticket className="h-6 w-6 text-primary" />
            Book Tickets
          </DialogTitle>
          <DialogDescription>
            Confirm the number of tickets for "{event.title}".
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-6">
            <div className="space-y-2">
                <Label htmlFor="ticket-tier">Ticket Type</Label>
                 <Select value={selectedTierId} onValueChange={setSelectedTierId}>
                    <SelectTrigger id="ticket-tier">
                        <SelectValue placeholder="Select a ticket type" />
                    </SelectTrigger>
                    <SelectContent>
                        {event.ticketing?.tiers?.map(tier => (
                            <SelectItem key={tier.id} value={tier.id} disabled={tier.quantityAvailable === 0}>
                               {tier.name} - ₹{tier.price} ({tier.quantityAvailable} left)
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            
            <div className="flex items-center justify-center gap-4">
                <Button variant="outline" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                    <Minus className="h-4 w-4" />
                </Button>
                 <span className="text-4xl font-bold w-20 text-center">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => handleQuantityChange(1)} disabled={quantity >= maxQuantity}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            <Separator />
            <div className="flex justify-between items-center text-lg">
                <span className="font-medium text-muted-foreground">Total Price:</span>
                <span className="font-bold text-primary">₹{totalPrice.toLocaleString()}</span>
            </div>
        </div>

        <DialogFooter className='sm:justify-between'>
            <DialogClose asChild>
                 <Button variant="outline" disabled={isBooking}>Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
                <Button onClick={handleConfirmBooking} disabled={isBooking || !selectedTier}>
                  {isBooking ? <Loader2 className='animate-spin' /> : "Confirm Booking"}
                </Button>
            </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
