import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";

const GlobalSearch = () => {
  return (
    <div className="relative hidden w-full max-w-[600px] lg:block">
      <div className="background-light800_darkgradient relative flex min-h-14 grow items-center gap-1 rounded-xl px-4">
        <Image
          src="/assets/icons/search.svg"
          width={24}
          height={24}
          alt="Search"
          className="cursor-pointer"
        />
        <Input
          placeholder="Search"
          className="paragraph-regular no-focus placeholder background-light800_darkgradient border-none shadow-none outline-none"
          type="text"
        />
      </div>
    </div>
  );
};

export default GlobalSearch;
