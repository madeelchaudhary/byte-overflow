import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

interface Props {
  title?: string;
  description?: string;
  link?: string;
  linkText?: string;
}

const NoResultsFound = ({ title, description, link, linkText }: Props) => {
  return (
    <div className="mt-10 flex w-full flex-col items-center justify-center">
      <Image
        src={"/assets/images/light-illustration.png"}
        alt="No Results Found"
        width={270}
        height={200}
        className="object-contain dark:hidden"
      />
      <Image
        src={"/assets/images/dark-illustration.png"}
        alt="No Results Found"
        width={270}
        height={200}
        className="hidden object-contain dark:block"
      />
      <h2 className="h2-bold text-dark200_light900 mt-8">
        {title || "No questions to show"}
      </h2>
      <p className="text-dark500_light700 body-regular my-3.5 max-w-md text-center">
        {description ||
          "Be the first one to ask a question. Ask a question and quick start the discussion. Your question could help someone else. Get involved!"}
      </p>
      <Button
        className="paragraph-medium mt-5 min-h-11 rounded-lg bg-primary-500 px-4 py-3 text-light-900 hover:bg-primary-500 dark:bg-primary-500 dark:text-light-900"
        asChild
      >
        <Link href={link || "/ask"}>{linkText || "Ask a Question"}</Link>
      </Button>
    </div>
  );
};

export default NoResultsFound;
