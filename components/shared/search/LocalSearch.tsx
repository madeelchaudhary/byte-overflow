"use client";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";

interface Props {
  img: string;
  imgSide?: "left" | "right";
  route: string;
  placeholder: string;
  className?: string;
}

const LocalSearch = ({
  className,
  imgSide = "left",
  img,
  placeholder,
}: Props) => {
  return (
    <div
      className={`background-light800_darkgradient relative flex min-h-14 grow items-center gap-4 overflow-hidden rounded-xl px-4 ${className}`}
    >
      {imgSide === "left" && (
        <Image
          src={img}
          width={24}
          height={24}
          alt="Search"
          className="pointer-events-none"
        />
      )}
      <Input
        placeholder={placeholder}
        className="paragraph-regular no-focus placeholder absolute h-full w-full border-none bg-transparent pl-10 shadow-none outline-none"
        type="text"
        onChange={() => {}}
      />
      {imgSide === "right" && (
        <Image
          src={img}
          width={24}
          height={24}
          alt="Search"
          className="pointer-events-none"
        />
      )}
    </div>
  );
};

export default LocalSearch;
