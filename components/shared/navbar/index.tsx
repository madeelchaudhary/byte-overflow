import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ThemeToggle from "./ThemeToggle";
import MobileNav from "./MobileNav";
import GlobalSearch from "../search/GlobalSearch";

const Navbar = () => {
  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12">
      <Link className="flex items-center gap-1" href="/">
        <Image
          src="/assets/images/site-logo.svg"
          alt="Dev Flow"
          height={23}
          width={23}
        />
        <p className="h2-bold hidden font-spaceGrotesk text-dark-100 dark:text-light-900 sm:block">
          Dev
          <span className="text-primary-500">Overflow</span>
        </p>
      </Link>
      <GlobalSearch />
      <div className="flex-between gap-5">
        <ThemeToggle />
        <SignedIn>
          <UserButton
            appearance={{
              elements: { avatarBox: "w-10 h-10" },
              variables: { colorPrimary: "text-primary-500" },
            }}
          />
        </SignedIn>
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
