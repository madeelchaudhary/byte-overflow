"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Sidebar_Links } from "@/constants/links";
import { SignedOut, useAuth } from "@clerk/nextjs";
import { AlignJustify } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavContent = () => {
  const path = usePathname();
  const { userId } = useAuth();

  return (
    <section className="flex h-full flex-col gap-6 pt-16">
      {Sidebar_Links.map((link) => {
        const isActive = path === link.href;

        if (link.href === "/profile" && !userId) return null;
        if (link.href === "/profile" && userId)
          link.href = `/profile/${userId}`;

        return (
          <SheetClose key={link.href} asChild>
            <Link
              href={link.href}
              className={`flex items-center justify-start gap-4 bg-transparent p-4 ${
                isActive
                  ? "primary-gradient rounded-lg text-light-900"
                  : "text-dark300_light900"
              }`}
            >
              <Image
                src={link.image}
                alt={link.title}
                height={20}
                width={20}
                className={!isActive ? "invert-colors" : ""}
              />
              <p className={isActive ? "base-bold" : "base-medium"}>
                {link.title}
              </p>
            </Link>
          </SheetClose>
        );
      })}
    </section>
  );
};

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="h-auto w-auto" size="icon">
          <AlignJustify className="h-6 w-6 text-dark-400 dark:text-light-900 sm:hidden" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="background-light900_dark200 border-none"
      >
        <Link className="flex items-center gap-1" href="/">
          <Image
            src="/assets/images/site-logo.svg"
            alt="Byte Overflow"
            height={23}
            width={23}
          />
          <p className="h2-bold  text-dark100_light900 font-spaceGrotesk">
            Byte
            <span className="text-primary-500">Overflow</span>
          </p>
        </Link>

        <div>
          <SheetClose asChild>
            <NavContent />
          </SheetClose>
          <div>
            <SignedOut>
              <div className="flex flex-col gap-3">
                <SheetClose asChild>
                  <Link href="/sign-in">
                    <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none ">
                      <span className="primary-text-gradient">Log In</span>
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/sign-up">
                    <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                      Sign Up
                    </Button>
                  </Link>
                </SheetClose>
              </div>
            </SignedOut>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
