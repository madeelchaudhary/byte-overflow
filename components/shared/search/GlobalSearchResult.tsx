"use client";
import { useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import GlobalSearchFilters from "./GlobalSearchFilters";

const DUMMY_RESULTS = [
  {
    _id: "1",
    title: "Title 1",
    description: "Description 1",
    type: "question",
  },
  {
    _id: "2",
    title: "Title 2",
    description: "Description 2",
    type: "question",
  },
  {
    _id: "3",
    title: "Title 3",
    description: "Description 3",
    type: "question",
  },
  {
    _id: "4",
    title: "Title 4",
    description: "Description 4",
    type: "question",
  },
  { _id: "5", title: "Tag 1", description: "Description 5", type: "tag" },
];

function getItemLink(item: any) {
  return `${item.type}/${item._id}`;
}

const GlobalSearchResult = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(DUMMY_RESULTS);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const query = searchParams.get("gq");
  const filter = searchParams.get("gf");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/search?query=${query}`);
        const data = await res.json();
        setResults(data);
        setIsLoading(false);
      } catch (error) {
        setError("An error occurred while fetching the results.");
        setIsLoading(false);
      }
    };

    // if (query) {
    //   fetchResults();
    // }
  }, [query, filter]);

  return (
    <div className="absolute top-full z-10 mt-3 w-full rounded-xl bg-light-800 py-5 shadow-sm dark:bg-dark-400">
      <GlobalSearchFilters />
      <div className="my-5 h-[1px] bg-light-700/50 dark:bg-dark-500/50"></div>
      <div className="space-y-5">
        <p className="paragraph-semibold text-dark400_light900 px-5">
          Top Match
        </p>

        {isLoading && (
          <div className="flex-center flex-col px-5">
            <ReloadIcon className="my-2 h-10 w-10 animate-spin text-primary-500" />
            <p className="text-dark200_light800 body-regular">
              Browsing the database for the best results.
            </p>
          </div>
        )}
        {!isLoading && (
          <div className="flex flex-col gap-2">
            {results.length === 0 && (
              <div className="px-5 py-2.5 text-center">
                <p className="text-dark200_light800 body-regular px-5">
                  Oops, no results found.
                </p>
              </div>
            )}
            {results.map((item: any) => (
              <Link
                key={item._id}
                href={getItemLink(item)}
                className="flex items-start gap-3 px-5 py-2.5 transition-colors hover:bg-light-700/50 dark:hover:bg-dark-500/50"
              >
                <Image
                  src="/assets/icons/tag.svg"
                  width={18}
                  height={18}
                  alt="Tag"
                  className="invert-colors mt-1 object-contain
                  "
                />
                <div className="flex flex-col">
                  <p className="body-medium text-dark200_light800 line-clamp-1">
                    {item.title}
                  </p>
                  <p className="text-light400_light500 small-medium mt-1 font-bold capitalize">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSearchResult;
