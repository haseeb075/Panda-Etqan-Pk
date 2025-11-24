// components/Images/SvgImage.js
import React from "react";
import Image from "next/image";

/**
 * Reusable SVG Image Component
 * @param {string} src - Path to SVG file
 * @param {string} alt - Alt text for accessibility
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {object} style - Additional styles
 * @param {string} className - CSS classes
 * @param {function} onClick - Click handler
 */
const SVGImage = ({
  src,
  alt,
  width = 24,
  height = 24,
  style = {},
  className = "",
  onClick,
  ...props
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
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
      {...props}
    />
  );
};

export default SVGImage;
