
'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { UploadCloud, Loader2, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase/config';
import { nanoid } from 'nanoid';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/lib/firebase/auth';

interface ImageUploaderProps {
  fieldName: string;
  imageUrl?: string | null;
  aspect?: number;
  onUploadingChange?: (isUploading: boolean) => void;
}

// Helper to get the canvas for drawing the cropped image
function getCroppedCanvas(
  image: HTMLImageElement,
  crop: PixelCrop,
  scale = 1,
  rotate = 0
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const pixelRatio = window.devicePixelRatio || 1;
  
  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);
  
  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = 'high';
  
  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;
  
  const rotateRads = (rotate * Math.PI) / 180;
  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;
  
  ctx.save();
  ctx.translate(-cropX, -cropY);
  ctx.translate(centerX, centerY);
  ctx.rotate(rotateRads);
  ctx.scale(scale, scale);
  ctx.translate(-centerX, -centerY);
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight
  );
  
  ctx.restore();
  
  return canvas;
}


export function ImageUploader({ fieldName, imageUrl, aspect = 16 / 9, onUploadingChange }: ImageUploaderProps) {
  const { setValue, getValues } = useFormContext();
  const [isUploading, setIsUploading] = useState(false);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const { user } = useAuth();

  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputId = `file-upload-${fieldName.replace('.', '-')}`;

  const { toast } = useToast();

  useEffect(() => {
    onUploadingChange?.(isUploading);
  }, [isUploading, onUploadingChange]);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined) // Makes crop preview update between images.
      const reader = new FileReader()
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || ''),
      )
      reader.readAsDataURL(e.target.files[0])
      setIsCropOpen(true);
    }
  };

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget
      setCrop(centerCrop(makeAspectCrop({ unit: '%', width: 90 }, aspect, width, height), width, height))
    }
  }

  // Effect to draw preview
  useEffect(() => {
    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current &&
      previewCanvasRef.current
    ) {
        const canvas = getCroppedCanvas(imgRef.current, completedCrop, scale, rotate);
        const previewCtx = previewCanvasRef.current.getContext('2d');
        if (previewCtx) {
          previewCanvasRef.current.width = canvas.width;
          previewCanvasRef.current.height = canvas.height;
          previewCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
        }
    }
  }, [completedCrop, scale, rotate]);


  const handleUploadCroppedImage = async () => {
    if (!imgRef.current || !completedCrop || !user) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not upload image. User not found.' });
        return;
    }

    setIsUploading(true);
    setIsCropOpen(false);

    const canvas = getCroppedCanvas(imgRef.current, completedCrop, scale, rotate);
    const base64Image = canvas.toDataURL('image/jpeg', 0.8); // Compress image to 80% quality

    try {
        const storageRef = ref(storage, `uploads/${user.uid}/${nanoid()}.jpg`);
        await uploadString(storageRef, base64Image, 'data_url');
        const downloadURL = await getDownloadURL(storageRef);

        setValue(fieldName, downloadURL, { shouldValidate: true, shouldDirty: true });
        toast({ title: 'Image Uploaded', description: 'The cropped image has been successfully uploaded.' });
    } catch (error) {
        toast({ variant: 'destructive', title: 'Upload Failed', description: 'There was a problem uploading your image. Please check storage permissions.' });
        console.error("Image Upload Error:", error);
    } finally {
        setIsUploading(false);
        setImgSrc('');
    }
  };
  
  const handleRemoveImage = () => {
    setValue(fieldName, null, { shouldValidate: true, shouldDirty: true });
  }

  const currentImageUrl = getValues(fieldName) || imageUrl;

  return (
    <div className="w-full">
      {currentImageUrl ? (
        <div className="relative group aspect-video">
           <Image src={currentImageUrl} alt="Uploaded preview" fill className="object-cover rounded-md" data-ai-hint="uploaded image" />
           <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="destructive" size="icon" onClick={handleRemoveImage} aria-label="Remove image">
                    <Trash2 />
                </Button>
           </div>
        </div>
      ) : (
        <Label htmlFor={fileInputId} className="w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors cursor-pointer relative">
          {isUploading ? (
              <>
                <Loader2 className="mx-auto h-10 w-10 mb-2 animate-spin" />
                <p className="text-sm">Uploading...</p>
              </>
          ) : (
            <>
              <UploadCloud className="mx-auto h-10 w-10 mb-2" />
              <p className="text-sm">Click or drag to upload</p>
            </>
          )}
          <Input 
            id={fileInputId}
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer sr-only"
            onChange={onSelectFile}
            disabled={isUploading}
            accept="image/*"
          />
        </Label>
      )}

      <Dialog open={isCropOpen} onOpenChange={setIsCropOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
            <DialogDescription>Crop, scale, and rotate your image to fit perfectly.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {imgSrc && (
              <div className="flex flex-col items-center space-y-4">
                 <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspect}
                    minWidth={100}
                >
                    <Image
                      ref={imgRef}
                      src={imgSrc}
                      alt="Crop preview"
                      width={400}
                      height={400 / (aspect || 1)}
                      style={{ transform: `scale(${scale}) rotate(${rotate}deg)`, maxHeight: '70vh', objectFit: 'contain' }}
                      onLoad={onImageLoad}
                    />
                </ReactCrop>
                <div className="w-full space-y-4 p-4 border rounded-lg">
                    <div className="space-y-2">
                        <Label htmlFor="scale">Scale: {scale.toFixed(2)}</Label>
                        <Slider id="scale" defaultValue={[1]} min={0.5} max={2} step={0.01} onValueChange={(value) => setScale(value[0])} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="rotate">Rotate: {rotate}°</Label>
                        <Slider id="rotate" defaultValue={[0]} min={-180} max={180} step={1} onValueChange={(value) => setRotate(value[0])} />
                    </div>
                </div>
              </div>
            )}
             <div className="flex flex-col items-center justify-center space-y-4">
                <Label>Preview</Label>
                <div className="p-2 border border-dashed rounded-lg">
                    {completedCrop && <canvas ref={previewCanvasRef} className="max-w-full h-auto rounded" />}
                </div>
             </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCropOpen(false)}>Cancel</Button>
            <Button onClick={handleUploadCroppedImage} disabled={isUploading}>{isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Processing...</> : 'Save Image'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
