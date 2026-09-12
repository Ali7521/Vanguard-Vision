import React, { useState, useRef } from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';

interface Props {
  onUpload: (id: string, url: string, location?: [number, number], hasExif?: boolean) => void;
}

export default function ImageUploader({ onUpload }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8765/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      onUpload(data.image_id, data.url, data.location, data.has_exif);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload image. Is the backend running?");
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      className={`w-full max-w-md p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center transition-colors cursor-pointer
        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => !isUploading && fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
        accept="image/jpeg, image/png, image/tiff"
      />
      
      {isUploading ? (
        <div className="flex flex-col items-center text-blue-600">
          <Loader2 className="w-12 h-12 mb-4 animate-spin" />
          <p className="text-sm font-medium">Uploading image...</p>
        </div>
      ) : (
        <>
          <UploadCloud className={`w-12 h-12 mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
          <h3 className="text-lg font-semibold text-gray-700 mb-1">Upload satellite imagery</h3>
          <p className="text-sm text-gray-500">Drag and drop or click to select</p>
          <p className="text-xs text-gray-400 mt-4">Supports JPG, PNG, GeoTIFF</p>
        </>
      )}
    </div>
  );
}
