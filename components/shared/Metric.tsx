import Image from "next/image";
import React from "react";

interface Props {
  img: string;
  alt: string;
  text: string;
  value: number | string;
  href?: string;
  isAuthor?: boolean;
  textStyles?: string;
}

const Metric = ({
  img,
  alt,
  text,
  value,
  textStyles,
  href,
  isAuthor,
}: Props) => {
  return (
    <div className="flex-center flex-wrap gap-1">
      <Image
        src={img}
        alt={alt}
        width={16}
        height={16}
        className={`object-contain ${href ? "rounded-full" : ""}`}
      />
      <p className={textStyles + " flex items-center gap-1"}>
        <span>{value}</span>
        <span
          className={`small-regular line-clamp-1 ${
            isAuthor ? "max-sm:hidden" : ""
          }`}
        >
          {text}
        </span>
      </p>
    </div>
  );
};

export default Metric;
