import React from "react";
import Image from "next/image";
import { StaticImageData } from "next/image";

/**
 * Reusable PNG Image Component
 * @param {string | StaticImageData} src - Path to image file (string for public folder) or imported image object
 * @param {string} alt - Alt text for accessibility
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {object} style - Additional styles
 * @param {string} className - CSS classes
 * @param {function} onClick - Click handler
 * @param {boolean} priority - Preload important images
 */
const PNGImage = ({
  src,
  alt,
  width = 24,
  height = 24,
  style = {},
  className = "",
  onClick,
  priority = false,
  ...props
}: {
  src: string | StaticImageData;
  alt: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
  priority?: boolean;
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      style={{
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
      className={className}
      onClick={onClick}
      priority={priority}
      {...props}
    />
  );
};

export default PNGImage;
