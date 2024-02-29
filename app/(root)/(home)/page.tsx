import Link from "next/link";

import NoResultsFound from "@/components/shared/NoResultsFound";
import Filters from "@/components/shared/filter/Filters";
import TagFilter from "@/components/shared/filter/TagFilter";
import QuestionCard from "@/components/shared/questions/QuestionCard";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import { getQuestions } from "@/lib/data/questions";
import PaginationMenu from "@/components/shared/PaginationMenu";

interface Props {
  searchParams: {
    [key: string]: any;
  };
}

export default async function Home({ searchParams }: Props) {
  const q = searchParams.q || "";
  const filter = searchParams.filter || "";
  const page = searchParams.page ? Number(searchParams.page) : 1;

  const result = await getQuestions({ search: q, filter, page });
  const { questions, totalQuestions } = result;

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
        wrapperClassName="mt-10 flex md:flex max-md:hidden"
      />

      <div className="mt-10 flex w-full flex-col gap-6 ">
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard key={question._id} {...question} />
          ))
        ) : (
          <NoResultsFound />
        )}
      </div>

      <div className="mt-10">
        <PaginationMenu total={totalQuestions} />
      </div>
    </>
  );
}
