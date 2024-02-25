"use client";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import GlobalSearchResult from "./GlobalSearchResult";
import Backdrop from "../Backdrop";

const GlobalSearch = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("gq");
  const [search, setSearch] = useState(query || "");
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = useCallback(
    (term: string) => {
      if (term.trim()) {
        const params = new URLSearchParams(searchParams);
        params.set("gq", term);
        params.delete("page");
        params.delete("q");
        const url = `${pathname}?${params.toString()}`;
        if (!isOpen) setIsOpen(true);
        router.push(url);
      } else {
        const params = new URLSearchParams(searchParams);
        if (!params.get("gq")) {
          if (isOpen) setIsOpen(false);
          return;
        }
        params.delete("gq");
        const url = `${pathname}?${params.toString()}`;
        if (isOpen) setIsOpen(false);
        router.push(url);
      }
    },
    [router, pathname, searchParams, isOpen]
  );

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

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
    <div className="relative hidden w-full max-w-[600px] lg:block">
      <div className="background-light800_darkgradient relative flex min-h-14 grow items-center gap-1 rounded-xl px-4">
        <Image
          src="/assets/icons/search.svg"
          width={24}
          height={24}
          alt="Search"
          className="pointer-events-none"
        />
        <Input
          value={search}
          onChange={onSearch}
          placeholder="Search"
          className="paragraph-regular no-focus placeholder text-dark400_light700 absolute h-full w-full border-none bg-transparent pl-10 shadow-none outline-none"
          type="text"
        />
      </div>

      {isOpen && (
        <>
          <GlobalSearchResult />
          <Backdrop
            onClick={() => {
              setSearch("");
              setIsOpen(false);
            }}
          />
        </>
      )}
    </div>
  );
};

export default GlobalSearch;
