"use client";

import Image from "next/image";
import Link from "next/link";
import type { Item, Category } from "@/types";
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
  Copy,
  Calendar,
  Loader2,
  Award,
  Newspaper,
  BookOpen
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { format } from 'date-fns';
import { Timestamp } from "firebase/firestore";
import { useAuth } from "@/lib/firebase/auth";
import { reportItem, toggleSaveItem } from "@/actions/contact-actions";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";

const categoryIcons: Record<Category, React.ReactNode> = {
  Event: <CalendarDays className="h-4 w-4" />,
  Community: <Users className="h-4 w-4" />,
  Business: <Store className="h-4 w-4" />,
  Deal: <TicketPercent className="h-4 w-4" />,
  Movie: <Film className="h-4 w-4" />,
  Lesson: <BookOpen className="h-4 w-4" />,
  Classified: <Newspaper className="h-4 w-4" />,
  Perk: <Award className="h-4 w-4" />,
};

export function ItemCard({ item }: { item: Item }) {
  const [isSaved, setIsSaved] = useState(false); // This should be fetched from user data later
  const [isSaving, setIsSaving] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  
  const hasDetailPage = item.category !== 'Lesson';
  const itemUrl = (typeof window !== 'undefined' && hasDetailPage) ? `${window.location.origin}/${item.category.toLowerCase()}s/${item.slug}` : '';

  const handleSaveToggle = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: "Login Required",
        description: "You must be logged in to save items.",
      });
      return;
    }
    setIsSaving(true);
    try {
      const result = await toggleSaveItem(user.uid, item.id, item.category);
      setIsSaved(result.saved);
      toast({
        title: result.saved ? "Item Saved!" : "Item Unsaved",
        description: `"${item.title}" has been ${result.saved ? 'added to' : 'removed from'} your saved items.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: "Error",
        description: "Could not update your saved items. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyLink = () => {
    if (!itemUrl) return;
    navigator.clipboard.writeText(itemUrl);
    toast({
      title: "Link Copied!",
      description: "The link has been copied to your clipboard.",
    });
  };

  const handleReportSubmit = async () => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in to report content.' });
      return;
    }
    if (reportReason.length < 10) {
        toast({ variant: 'destructive', title: 'Invalid Reason', description: 'Please provide a reason with at least 10 characters.' });
        return;
    }
    setIsReporting(true);
    try {
      await reportItem({
        itemId: item.id,
        itemType: item.category,
        itemTitle: item.title,
        reason: reportReason,
        reporterId: user.uid,
      });
      toast({
        title: "Report Submitted",
        description: `Thank you for reporting "${item.title}". Our team will review it shortly.`,
      });
      setIsReportDialogOpen(false);
      setReportReason("");
    } catch (error) {
       toast({ variant: 'destructive', title: 'Error', description: 'Failed to submit report. Please try again.' });
    } finally {
        setIsReporting(false);
    }
  }

  const getDate = () => {
    if (!item.date) return null;
    let dateObj: Date | null = null;
    try {
        if (item.date instanceof Timestamp) {
            dateObj = item.date.toDate();
        } else if (typeof item.date === 'string' && !isNaN(Date.parse(item.date))) {
            dateObj = new Date(item.date);
        } else if (item.date instanceof Date) {
            dateObj = item.date;
        }
        // Check if date is valid
        if (dateObj && !isNaN(dateObj.getTime())) {
            return dateObj;
        }
    } catch (e) {
        // Malformed date, ignore
    }
    return null;
  }

  const date = getDate();
  const linkPath = hasDetailPage ? `/${item.category.toLowerCase()}s/${item.slug}` : '#';
  const CardRootComponent = hasDetailPage ? Link : 'div';

  return (
    <Card className="flex flex-col overflow-hidden h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
      <CardRootComponent href={linkPath} className="flex flex-col flex-grow">
        <div className="aspect-video relative">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              data-ai-hint={`${item.category.toLowerCase()} photo`}
            />
          </div>
        <CardHeader className="p-4">
          <CardTitle className="font-headline text-xl leading-snug truncate">
            {item.title}
          </CardTitle>
          <CardDescription className="flex items-center gap-2 pt-1 text-sm">
            <MapPin className="h-4 w-4" /> {item.location}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow px-4 pb-4">
            {date && (
                <div className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>{format(date, "PPP")}</span>
                </div>
            )}
          <p className="text-sm text-muted-foreground line-clamp-3">
            {item.description}
          </p>
        </CardContent>
      </CardRootComponent>
      <CardFooter className="flex justify-between items-center pt-2 p-4 mt-auto">
        <Badge variant="secondary" className="gap-2">
          {categoryIcons[item.category] || <Store className="h-4 w-4" />}
          {item.category}
        </Badge>
        {hasDetailPage && (
             <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSaveToggle}
                    aria-label="Save item"
                    disabled={isSaving}
                >
                    {isSaving ? <Loader2 className="animate-spin h-5 w-5" /> : 
                    <Heart
                    className={cn("h-5 w-5 transition-colors",
                        isSaved ? "text-red-500 fill-current" : "text-muted-foreground"
                    )}
                    />
                    }
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
                        <Image src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${itemUrl}`} width={150} height={150} alt="QR Code" data-ai-hint="qr code" />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Input
                        id="link"
                        defaultValue={itemUrl}
                        readOnly
                        />
                        <Button type="button" size="sm" className="px-3" onClick={handleCopyLink}>
                        <span className="sr-only">Copy</span>
                        <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="More options">
                        <MoreVertical className="h-5 w-5 text-muted-foreground" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => {
                            e.preventDefault();
                            if(!user) {
                                toast({ variant: 'destructive', title: 'Login Required', description: 'You must be logged in to report content.' });
                            } else {
                                setIsReportDialogOpen(true);
                            }
                        }}>
                            <Flag className="mr-2 h-4 w-4" />
                            <span>Report {item.category}</span>
                        </DropdownMenuItem>
                        </DialogTrigger>
                    </DropdownMenuContent>
                    </DropdownMenu>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle className="font-headline">Report Content</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for reporting "{item.title}". Your report is anonymous.
                        </DialogDescription>
                        </DialogHeader>
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="reason">Reason</Label>
                            <Textarea 
                                placeholder="Explain why you are reporting this content..." 
                                id="reason"
                                value={reportReason}
                                onChange={(e) => setReportReason(e.target.value)}
                                rows={4}
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleReportSubmit} disabled={isReporting}>
                                {isReporting ? <Loader2 className="animate-spin" /> : "Submit Report"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        )}
      </CardFooter>
    </Card>
  );
}
