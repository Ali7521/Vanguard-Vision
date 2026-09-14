import React, { useState, useRef } from 'react';
import { UploadCloud, Loader2, Search } from 'lucide-react';

interface Props {
  onUpload: (id: string, url: string, location?: [number, number], hasExif?: boolean) => void;
}

export default function ImageUploader({ onUpload }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch('https://footage-posing-panda.ngrok-free.dev/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ query: searchQuery }),
      });
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      onUpload(data.image_id, data.url, data.location, data.has_exif);
    } catch (err) {
      console.error("Search failed", err);
      alert("Failed to find satellite imagery for that location.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://footage-posing-panda.ngrok-free.dev/api/upload', {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true'
        },
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
    <div className="w-full max-w-md flex flex-col gap-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input 
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search any location (e.g., Eiffel Tower)"
          className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
          disabled={isUploading || isSearching}
        />
        <button 
          type="submit"
          disabled={isUploading || isSearching || !searchQuery.trim()}
          className="px-4 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center min-w-[60px]"
        >
          {isSearching ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
        </button>
      </form>

      <div className="flex items-center gap-4">
        <div className="h-px bg-gray-300 flex-1"></div>
        <span className="text-xs text-gray-500 font-semibold uppercase">OR UPLOAD</span>
        <div className="h-px bg-gray-300 flex-1"></div>
      </div>

      <div 
        className={`w-full p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center transition-colors cursor-pointer
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !isUploading && !isSearching && fileInputRef.current?.click()}
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
          </>
        )}
      </div>
    </div>
  );
}
