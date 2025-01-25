import React, { useRef, useState, useEffect, ChangeEvent } from "react";
import { Upload } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void; // Changed to expect file instead of event
  initialPreviewUrl?: string | null;
}

const FileImageUpload: React.FC<FileUploadProps> = ({
  onChange,
  initialPreviewUrl,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    setPreviewUrl(initialPreviewUrl ?? null);
  }, [initialPreviewUrl]);

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the hidden file input
    }
  };

  return (
    <div className="relative">
      <div
        className="flex h-32 w-32 cursor-pointer items-center justify-center rounded-full bg-muted"
        onClick={handleIconClick}
      >
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Preview"
            className="h-32 w-32 rounded-full object-cover"
            fill
          />
        ) : (
          <Upload className="h-8 w-8 text-muted-foreground" />
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={onChange}
        className="hidden" // Hide the actual input element
      />
    </div>
  );
};

export default FileImageUpload;
