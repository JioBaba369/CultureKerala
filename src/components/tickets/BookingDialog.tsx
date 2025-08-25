
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
import type { Item } from '@/types';
import { Minus, Plus, Ticket } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function BookingDialog({
  item,
  children,
}: {
  item: Item;
  children: React.ReactNode;
}) {
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => Math.max(1, Math.min(10, prev + amount))); // Min 1, Max 10 tickets
  };
  
  const totalPrice = (item.price ?? 0) * quantity;

  const handleConfirmBooking = () => {
    // In a real app, this would trigger a payment flow.
    // For now, we'll just show a confirmation toast.
    toast({
        title: "Booking Confirmed!",
        description: `You've successfully booked ${quantity} ticket(s) for "${item.title}".`,
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center gap-2">
            <Ticket className="h-6 w-6 text-primary" />
            Book Tickets
          </DialogTitle>
          <DialogDescription>
            Confirm the number of tickets for "{item.title}".
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-6">
            <div className="flex items-center justify-center gap-4">
                <Button variant="outline" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                    <Minus className="h-4 w-4" />
                </Button>
                 <span className="text-4xl font-bold w-20 text-center">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => handleQuantityChange(1)} disabled={quantity >= 10}>
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
                 <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
                <Button onClick={handleConfirmBooking}>Confirm Booking</Button>
            </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
