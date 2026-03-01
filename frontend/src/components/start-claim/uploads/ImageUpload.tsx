"use client";

import { useRef } from "react";
import { Upload, X } from "lucide-react";

interface ImageFile {
  file: File;
  preview: string;
}

interface ImageUploadProps {
  images: ImageFile[];
  onUpload: (files: File[]) => void;
  onRemove: (index: number) => void;
  maxFiles?: number;
  accept?: string;
}

export function ImageUpload({
  images,
  onUpload,
  onRemove,
  maxFiles = 20,
  accept = "image/*"
}: ImageUploadProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      onUpload(selectedFiles);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files || []);
    if (droppedFiles.length > 0) {
      onUpload(droppedFiles);
    }
  };

  return (
    <div className="space-y-3">
      {/* Upload zone */}
      <div
        onClick={() => imageInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="flex flex-col items-center justify-center py-6 px-4 border border-dashed border-gray-300 rounded bg-gray-50 hover:bg-gray-100 hover:border-gray-400 cursor-pointer transition-colors"
      >
        <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center mb-2">
          <Upload className="w-5 h-5 text-gray-500" />
        </div>
        <p className="text-sm font-medium text-gray-700">
          Drop images here or click to browse
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          JPG, PNG up to 10MB {maxFiles && `(max ${maxFiles})`}
        </p>

        <input
          type="file"
          ref={imageInputRef}
          onChange={handleFileSelect}
          accept={accept}
          multiple
          className="hidden"
        />
      </div>

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
          {images.map((img, index) => (
            <div
              key={img.preview}
              className="group relative aspect-square rounded overflow-hidden border border-gray-200 bg-gray-100"
            >
              <img
                src={img.preview}
                alt={img.file.name}
                className="w-full h-full object-cover"
              />

              {/* Remove button */}
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute top-1 right-1 p-1 rounded bg-black/60 hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="w-3 h-3 text-white" />
              </button>

              {/* File name */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-1.5 py-1">
                <p className="text-[10px] text-white truncate">{img.file.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
