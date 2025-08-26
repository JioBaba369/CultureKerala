
'use client';

import { useState, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { UploadCloud, Loader2, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ref, uploadBytes, getDownloadURL, uploadString } from 'firebase/storage';
import { storage } from '@/lib/firebase/config';
import { nanoid } from 'nanoid';
import Image from 'next/image';
import { Button } from './button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './dialog';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageUploaderProps {
  fieldName: string;
  aspect?: number;
}

export function ImageUploader({ fieldName, aspect = 16 / 9 }: ImageUploaderProps) {
  const { setValue, watch } = useFormContext();
  const [isUploading, setIsUploading] = useState(false);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const { toast } = useToast();
  
  const imageUrl = watch(fieldName);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please select an image file.',
        });
        return;
      }
      setOriginalFile(file);
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(file);
      setIsCropOpen(true);
    }
  };

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspect,
        width,
        height
      ),
      width,
      height
    ));
  }

  const handleCrop = async () => {
    if (!imgRef.current || !crop || !originalFile) {
        return;
    }

    setIsUploading(true);
    setIsCropOpen(false);

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    canvas.width = Math.floor(crop.width * scaleX);
    canvas.height = Math.floor(crop.height * scaleY);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        toast({
            variant: 'destructive',
            title: 'Crop Failed',
            description: 'Could not create a canvas for cropping.',
        });
        setIsUploading(false);
        return;
    }

    const pixelRatio = window.devicePixelRatio;
    canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio);
    ctx.scale(pixelRatio, pixelRatio);

    const image = imgRef.current;
    
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
    
    const base64Image = canvas.toDataURL(originalFile.type);
    
    try {
        const storageRef = ref(storage, `uploads/${nanoid()}-${originalFile.name}`);
        const snapshot = await uploadString(storageRef, base64Image, 'data_url');
        const downloadURL = await getDownloadURL(snapshot.ref);

        setValue(fieldName, downloadURL, { shouldValidate: true, shouldDirty: true });
        toast({ title: 'Image Uploaded', description: 'The cropped image has been successfully uploaded.' });
    } catch (error) {
        console.error("Upload failed", error);
        toast({ variant: 'destructive', title: 'Upload Failed', description: 'There was a problem uploading your image. Please check storage permissions.' });
    } finally {
        setIsUploading(false);
        setImgSrc('');
        setOriginalFile(null);
    }
  };
  
  const handleRemoveImage = () => {
    setValue(fieldName, '', { shouldValidate: true, shouldDirty: true });
  }

  return (
    <div className="w-full">
      {imageUrl ? (
        <div className="relative group aspect-video">
           <Image src={imageUrl} alt="Uploaded preview" fill className="object-cover rounded-md" />
           <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="destructive" size="icon" onClick={handleRemoveImage}>
                    <Trash2 />
                </Button>
           </div>
        </div>
      ) : (
        <div className="w-full h-48 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors cursor-pointer relative">
          {isUploading ? (
              <div className="text-center">
                <Loader2 className="mx-auto h-10 w-10 mb-2 animate-spin" />
                <p className="text-sm">Uploading...</p>
              </div>
          ) : (
            <div className="text-center">
              <UploadCloud className="mx-auto h-10 w-10 mb-2" />
              <p className="text-sm">Click or drag to upload</p>
            </div>
          )}
          <Input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={onSelectFile}
            disabled={isUploading}
            accept="image/*"
          />
        </div>
      )}

      <Dialog open={isCropOpen} onOpenChange={setIsCropOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crop your image</DialogTitle>
          </DialogHeader>
          {imgSrc && (
            <div className="flex justify-center">
                <ReactCrop
                    crop={crop}
                    onChange={c => setCrop(c)}
                    aspect={aspect}
                >
                    <Image
                      ref={imgRef}
                      src={imgSrc}
                      alt="Crop preview"
                      width={500}
                      height={500}
                      onLoad={onImageLoad}
                      className="max-h-[60vh] object-contain"
                    />
                </ReactCrop>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCropOpen(false)}>Cancel</Button>
            <Button onClick={handleCrop} disabled={isUploading}>{isUploading ? 'Saving...' : 'Save Crop'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
