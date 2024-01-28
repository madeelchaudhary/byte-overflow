"use client";
import { Button } from "@/components/ui/button";
import { Sidebar_Links } from "@/constants/links";
import { SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import path from "path";

const LeftSideBar = () => {
  const path = usePathname();

  return (
    <aside className="light-border background-light900_dark200 custom-scrollbar sticky left-0 top-0 hidden h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none sm:flex lg:w-[266px]">
      <div className="flex flex-1 flex-col gap-6">
        {Sidebar_Links.map((link) => {
          const isActive = path === link.href;
          return (
            <Link
              key={link.href}
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
              <div className="hidden lg:block">
                <p className={isActive ? "base-bold" : "base-medium"}>
                  {link.title}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
      <div>
        <SignedOut>
          <div className="flex flex-col gap-3">
            <Link href="/sign-in">
              <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none ">
                <Image
                  src="/assets/icons/account.svg"
                  width={20}
                  height={20}
                  alt="Log In"
                  className="invert-colors lg:hidden"
                />
                <span className="primary-text-gradient hidden lg:inline">
                  Log In
                </span>
              </Button>
            </Link>

            <Link href="/sign-up">
              <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                <Image
                  src="/assets/icons/sign-up.svg"
                  width={20}
                  height={20}
                  alt="Log In"
                  className="invert-colors lg:hidden"
                />
                <span className="hidden lg:inline">Sign Up</span>
              </Button>
            </Link>
          </div>
        </SignedOut>
      </div>
    </aside>
  );
};

export default LeftSideBar;
