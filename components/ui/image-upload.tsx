"use client";

import { useState, useRef } from "react";
import { Button } from "./button";
import { Card } from "./card";
import { useImageUpload, type UploadResult } from "@/hooks/use-image-upload";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  onUpload: (result: UploadResult) => void;
  onRemove?: () => void;
  currentImage?: string;
  className?: string;
  disabled?: boolean;
  multiple?: boolean;
}

export function ImageUpload({
  onUpload,
  onRemove,
  currentImage,
  className = "",
  disabled = false,
  multiple = false,
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, isUploading, error } = useImageUpload();

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const result = await uploadImage(file);

    if (result) {
      onUpload(result);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    handleFileSelect(e.dataTransfer.files);
  };

  const handleClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className={className}>
      <Card
        className={`
          relative border-2 border-dashed transition-colors cursor-pointer
          ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25"
          }
          ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:border-primary/50"
          }
          ${currentImage ? "p-2" : "p-8"}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled}
        />

        {currentImage ? (
          <div className="relative group">
            <img
              src={currentImage}
              alt="Uploaded"
              className="w-full h-32 object-cover rounded-md"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-sm font-medium">
                    Drop an image here or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, GIF, WebP up to 5MB
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </Card>

      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  );
}
