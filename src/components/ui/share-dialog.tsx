
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';
import Image from 'next/image';

interface ShareDialogProps {
  itemUrl: string;
  title: string;
  trigger: React.ReactNode;
}

export function ShareDialog({ itemUrl, title, trigger }: ShareDialogProps) {
    const { toast } = useToast();
    const [fullUrl, setFullUrl] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    
    // We need to construct the full URL on the client side to avoid hydration errors
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const url = `${window.location.origin}${itemUrl}`;
            setFullUrl(url);
            setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}&color=222222&bgcolor=ffffff&margin=10`);
        }
    }, [itemUrl]);
    
    const handleCopyLink = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(fullUrl);
        toast({
            title: "Link Copied!",
            description: "The link has been copied to your clipboard.",
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild onClick={(e) => {e.preventDefault(); e.stopPropagation()}}>
              {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-headline">Share "{title}"</DialogTitle>
                    <DialogDescription>
                        Anyone with this link will be able to view this page.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center py-4">
                    <div className="p-4 bg-white rounded-lg">
                        {qrCodeUrl ? <Image
                            src={qrCodeUrl}
                            width={150}
                            height={150}
                            alt={`QR Code for ${title}`}
                            data-ai-hint="qr code"
                        /> : <div className='w-[150px] h-[150px] bg-gray-200 animate-pulse rounded-md' />}
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Input
                        id="link"
                        defaultValue={fullUrl}
                        readOnly
                    />
                    <Button type="button" size="sm" className="px-3" onClick={handleCopyLink} aria-label="Copy link">
                        <span className="sr-only">Copy</span>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
