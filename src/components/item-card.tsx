"use client";

import Image from "next/image";
import Link from "next/link";
import type { Item, Category } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Share2,
  MoreVertical,
  Flag,
  CalendarDays,
  Users,
  Store,
  TicketPercent,
  Film,
  MapPin,
  QrCode,
  Copy,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";

const categoryIcons: Record<Category, React.ReactNode> = {
  Events: <CalendarDays className="h-4 w-4" />,
  Communities: <Users className="h-4 w-4" />,
  Businesses: <Store className="h-4 w-4" />,
  Deals: <TicketPercent className="h-4 w-4" />,
  Movies: <Film className="h-4 w-4" />,
};

export function ItemCard({ item }: { item: Item }) {
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Removed from saved" : "Added to saved",
      description: `"${item.title}" has been ${isSaved ? "removed from" : "added to"} your saved items.`,
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://example.com/item/${item.id}`);
    toast({
      title: "Link Copied!",
      description: "The link has been copied to your clipboard.",
    });
  };

  const handleReportSubmit = () => {
    toast({
      title: "Report Submitted",
      description: `Thank you for reporting "${item.title}". Our team will review it shortly.`,
    });
  }

  return (
    <Card className="flex flex-col overflow-hidden h-full transition-all hover:shadow-lg hover:-translate-y-1">
      <Link href={`/${item.category.toLowerCase()}/${item.id}`} className="flex flex-col flex-grow">
        <CardHeader>
          <CardTitle className="font-headline text-xl leading-snug truncate">
            {item.title}
          </CardTitle>
          <CardDescription className="flex items-center gap-2 pt-1">
            <MapPin className="h-4 w-4" /> {item.location}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="aspect-video relative mb-4">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover rounded-md"
              data-ai-hint={`${item.category} ${item.title}`}
            />
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {item.description}
          </p>
        </CardContent>
      </Link>
      <CardFooter className="flex justify-between items-center">
        <Badge variant="secondary" className="gap-2">
          {categoryIcons[item.category]}
          {item.category}
        </Badge>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            aria-label="Save item"
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                isSaved ? "text-red-500 fill-current" : "text-muted-foreground"
              }`}
            />
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Share item">
                <Share2 className="h-5 w-5 text-muted-foreground" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-headline">Share "{item.title}"</DialogTitle>
                <DialogDescription>
                  Share this with your friends via link or QR code.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center justify-center py-4">
                <div className="p-4 bg-white rounded-lg">
                  <Image src="https://placehold.co/150x150.png" width={150} height={150} alt="QR Code" data-ai-hint="qr code" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  id="link"
                  defaultValue={`https://example.com/item/${item.id}`}
                  readOnly
                />
                <Button type="submit" size="sm" className="px-3" onClick={handleCopyLink}>
                  <span className="sr-only">Copy</span>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="More options">
                  <MoreVertical className="h-5 w-5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DialogTrigger asChild>
                  <DropdownMenuItem>
                    <Flag className="mr-2 h-4 w-4" />
                    <span>Report</span>
                  </DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
             <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-headline">Report Content</DialogTitle>
                  <DialogDescription>
                    Please provide a reason for reporting "{item.title}".
                  </DialogDescription>
                </DialogHeader>
                <Textarea placeholder="Explain why you are reporting this content..." rows={4}/>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button onClick={handleReportSubmit}>Submit Report</Button>
                  </DialogClose>
                </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardFooter>
    </Card>
  );
}
