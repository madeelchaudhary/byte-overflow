"use client";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const q = searchParams.get("q");
  const [search, setSearch] = useState(q || "");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    if (search.trim()) {
      const query = search.trim();
      params.set("q", query);
      params.delete("page");
      const url = `${pathname}?${params.toString()}`;
      router.push(url);
    } else {
      params.delete("q");
      const url = `${pathname}?${params.toString()}`;
      router.push(url);
    }
  }, [search, pathname, router, searchParams]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, onSearch]);

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
        value={search}
        onChange={handleSearch}
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
