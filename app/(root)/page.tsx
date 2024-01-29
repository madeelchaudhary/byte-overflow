import Link from "next/link";

import Filters from "@/components/shared/filter/Filters";
import TagFilter from "@/components/shared/filter/TagFilter";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";

export default function Home() {
  return (
    <>
      <div className=" flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Link href="/ask" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex flex-col justify-between gap-5 sm:flex-row sm:items-center ">
        <LocalSearch
          className="flex-1"
          placeholder="Search for questions"
          route="/"
          img="/assets/icons/search.svg"
          imgSide="left"
        />
        <Filters
          filters={HomePageFilters}
          className="min-h-14 sm:min-w-[170px]"
          wrapperClassName="max-md:flex hidden"
        />
      </div>

      <TagFilter
        filters={HomePageFilters}
        wrapperClassName="mt-10 flex md:flex"
      />
    </>
  );
}
