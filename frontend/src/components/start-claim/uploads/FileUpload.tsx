"use client";

import { useRef } from "react";
import { Upload, FileText, X } from "lucide-react";

interface FileUploadProps {
  file: File | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
  accept?: string;
  maxSize?: number;
}

export function FileUpload({
  file,
  onUpload,
  onRemove,
  accept = ".pdf",
  maxSize = 10
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > maxSize * 1024 * 1024) {
        alert(`File size exceeds ${maxSize}MB limit`);
        return;
      }
      onUpload(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (droppedFile.size > maxSize * 1024 * 1024) {
        alert(`File size exceeds ${maxSize}MB limit`);
        return;
      }
      onUpload(droppedFile);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove();
  };

  return (
    <div>
      {!file ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center py-8 px-4 border border-dashed border-gray-300 rounded bg-gray-50 hover:bg-gray-100 hover:border-gray-400 cursor-pointer transition-colors"
        >
          <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center mb-3">
            <Upload className="w-5 h-5 text-gray-500" />
          </div>
          <p className="text-sm font-medium text-gray-700 mb-0.5">
            Drop PDF here or click to browse
          </p>
          <p className="text-xs text-gray-500">
            Max {maxSize}MB
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept={accept}
            className="hidden"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 border border-gray-200 rounded bg-white">
          <div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
          </div>
          <button
            onClick={handleRemove}
            className="p-1.5 rounded hover:bg-red-50 transition-colors"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
          </button>
        </div>
      )}
    </div>
  );
}
