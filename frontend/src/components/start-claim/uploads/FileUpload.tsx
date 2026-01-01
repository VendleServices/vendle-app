"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, X } from "lucide-react";

interface FileUploadProps {
  file: File | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
  accept?: string;
  maxSize?: number; // in MB
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
      // Validate file size
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
      // Validate file size
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
    <div className="relative group">
      {!file ? (
        <div className="relative rounded-2xl bg-vendle-blue/20 p-[2px] hover:bg-vendle-blue/30 transition-all">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="relative flex flex-col items-center justify-center h-48 lg:h-56 rounded-2xl bg-white cursor-pointer"
          >
            {/* Animated upload icon */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-20 h-20 rounded-2xl bg-vendle-blue p-4 mb-4 shadow-lg"
            >
              <Upload className="w-full h-full text-white" />
            </motion.div>

            <p className="text-lg font-semibold text-foreground mb-1">
              Drop your PDF here or click to browse
            </p>
            <p className="text-sm text-muted-foreground">
              Max file size: {maxSize}MB
            </p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept={accept}
              className="hidden"
            />
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 lg:p-5 rounded-xl bg-vendle-teal/10 border-2 border-vendle-teal/30"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-lg bg-vendle-teal/20 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-vendle-teal" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="p-2 rounded-lg hover:bg-red-50 transition-colors group/remove flex-shrink-0"
            >
              <X className="w-5 h-5 text-muted-foreground group-hover/remove:text-red-600" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
