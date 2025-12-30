"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Eye, Trash2 } from "lucide-react";

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
    <div className="space-y-4">
      {/* Upload button */}
      <div
        onClick={() => imageInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="w-full p-8 rounded-2xl border-2 border-dashed border-vendle-gray/50 hover:border-vendle-blue bg-gradient-to-br from-vendle-blue/5 to-transparent hover:from-vendle-blue/10 transition-all group cursor-pointer"
      >
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-xl bg-vendle-blue/10 group-hover:bg-vendle-blue/20 flex items-center justify-center mb-3 transition-colors">
            <Upload className="w-7 h-7 text-vendle-blue" />
          </div>
          <p className="text-sm font-medium text-foreground">Upload property images</p>
          <p className="text-xs text-muted-foreground mt-1">
            JPG, PNG up to 10MB each {maxFiles && `(max ${maxFiles} files)`}
          </p>
        </div>

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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {images.map((img, index) => (
              <motion.div
                key={img.preview}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="group relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-vendle-blue transition-all"
              >
                <img
                  src={img.preview}
                  alt={img.file.name}
                  className="w-full h-full object-cover"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    className="p-2 bg-white rounded-lg hover:scale-110 transition-transform"
                  >
                    <Eye className="w-5 h-5 text-foreground" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="p-2 bg-white rounded-lg hover:scale-110 transition-transform"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>

                {/* File name badge */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <p className="text-xs text-white font-medium truncate">{img.file.name}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
