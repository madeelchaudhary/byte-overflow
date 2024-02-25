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

  const query = searchParams.get("q");
  const [search, setSearch] = useState(query || "");

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearch = useCallback(
    (term: string) => {
      if (term.trim()) {
        const params = new URLSearchParams(searchParams);
        params.set("q", term);
        params.delete("page");
        const url = `${pathname}?${params.toString()}`;
        router.push(url);
      } else {
        const params = new URLSearchParams(searchParams);
        if (!params.get("q")) return;
        params.delete("q");
        const url = `${pathname}?${params.toString()}`;
        router.push(url);
      }
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    setSearch(query || "");
  }, [query, pathname]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(search);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, handleSearch]);

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
        className="paragraph-regular no-focus placeholder text-dark400_light700 absolute h-full w-full border-none bg-transparent pl-10 shadow-none outline-none"
        type="text"
        value={search}
        onChange={onSearch}
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
