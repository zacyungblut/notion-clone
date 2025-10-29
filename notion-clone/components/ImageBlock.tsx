import React from "react";
import Image from "next/image";

interface ImageBlockProps {
  id: string;
  url?: string;
  imageWidth?: number;
  imageHeight?: number;
}

const ImageBlock: React.FC<ImageBlockProps> = ({
  id,
  url,
  imageWidth = 800,
  imageHeight = 600,
}) => {
  if (!url) {
    return (
      <div className="w-full py-2">
        <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 p-8">
          <p className="text-zinc-500 dark:text-zinc-400">
            No image URL provided
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-2">
      <div
        className="relative rounded-lg overflow-hidden"
        style={{ maxWidth: `${imageWidth}px` }}>
        <Image
          src={url}
          alt={`Block ${id}`}
          width={imageWidth}
          height={imageHeight}
          className="h-auto"
          style={{
            width: `${imageWidth}px`,
            height: `${imageHeight}px`,
            objectFit: "cover",
          }}
        />
      </div>
    </div>
  );
};

export default ImageBlock;
