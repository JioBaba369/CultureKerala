
'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { UploadCloud, Loader2, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase/config';
import { nanoid } from 'nanoid';
import Image from 'next/image';
import { Button } from './button';

interface ImageUploaderProps {
  fieldName: string;
}

export function ImageUploader({ fieldName }: ImageUploaderProps) {
  const { setValue, watch } = useFormContext();
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const imageUrl = watch(fieldName);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        toast({ variant: 'destructive', title: 'Invalid File Type', description: 'Please upload an image file.' });
        return;
    }

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `uploads/${nanoid()}-${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setValue(fieldName, downloadURL, { shouldValidate: true, shouldDirty: true });
      toast({ title: 'Image Uploaded', description: 'The image has been successfully uploaded.' });
    } catch (error) {
      console.error("Upload failed", error);
      toast({ variant: 'destructive', title: 'Upload Failed', description: 'There was a problem uploading your image.' });
    } finally {
      setIsUploading(false);
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
            onChange={handleFileChange}
            disabled={isUploading}
            accept="image/*"
          />
        </div>
      )}
    </div>
  );
}
