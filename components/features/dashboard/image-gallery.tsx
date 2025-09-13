"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/ui/image-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Download, Eye, Image as ImageIcon } from "lucide-react";
import type { UploadResult } from "@/hooks/use-image-upload";

interface ImageGalleryProps {
  className?: string;
}

export function ImageGallery({ className = "" }: ImageGalleryProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadResult[]>([]);
  const [selectedImage, setSelectedImage] = useState<UploadResult | null>(null);

  const handleImageUpload = (result: UploadResult) => {
    setUploadedImages((prev) => [result, ...prev]);
  };

  const handleImageRemove = (publicId: string) => {
    setUploadedImages((prev) =>
      prev.filter((img) => img.public_id !== publicId)
    );
    if (selectedImage?.public_id === publicId) {
      setSelectedImage(null);
    }
  };

  const clearAll = () => {
    setUploadedImages([]);
    setSelectedImage(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Image Gallery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload onUpload={handleImageUpload} className="w-full" />
        </CardContent>
      </Card>

      {/* Images Grid */}
      {uploadedImages.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Uploaded Images ({uploadedImages.length})</CardTitle>
              <Button variant="outline" size="sm" onClick={clearAll}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedImages.map((image) => (
                <div
                  key={image.public_id}
                  className={`relative group border rounded-lg overflow-hidden transition-all duration-200 ${
                    selectedImage?.public_id === image.public_id
                      ? "ring-2 ring-primary ring-offset-2"
                      : "hover:shadow-md"
                  }`}
                >
                  <img
                    src={image.secure_url}
                    alt={`Uploaded ${image.public_id}`}
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  />

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setSelectedImage(image)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => window.open(image.secure_url, "_blank")}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleImageRemove(image.public_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Image Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <div className="flex items-center justify-between text-white text-xs">
                      <Badge variant="secondary" className="text-xs">
                        {image.format.toUpperCase()}
                      </Badge>
                      <span>{formatFileSize(image.bytes)}</span>
                    </div>
                    <p className="text-white text-xs mt-1">
                      {image.width} × {image.height}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-[90vh] bg-background rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Image Preview</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedImage(null)}
              >
                ×
              </Button>
            </div>
            <div className="p-4">
              <img
                src={selectedImage.secure_url}
                alt="Preview"
                className="max-w-full max-h-[60vh] object-contain mx-auto"
              />
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Format</p>
                  <p className="font-medium">
                    {selectedImage.format.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Size</p>
                  <p className="font-medium">
                    {formatFileSize(selectedImage.bytes)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Dimensions</p>
                  <p className="font-medium">
                    {selectedImage.width} × {selectedImage.height}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Public ID</p>
                  <p className="font-medium text-xs truncate">
                    {selectedImage.public_id}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={() =>
                    window.open(selectedImage.secure_url, "_blank")
                  }
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    navigator.clipboard.writeText(selectedImage.secure_url)
                  }
                  className="flex-1"
                >
                  Copy URL
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
