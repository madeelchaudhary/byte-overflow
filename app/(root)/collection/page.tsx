import { auth } from "@clerk/nextjs";
import { notFound } from "next/navigation";

import NoResultsFound from "@/components/shared/NoResultsFound";
import Filters from "@/components/shared/filter/Filters";
import QuestionCard from "@/components/shared/questions/QuestionCard";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { QuestionFilters } from "@/constants/filters";
import { getSavedQuestions } from "@/lib/data/user";

const page = async () => {
  const { userId } = auth();

  if (!userId) {
    return notFound();
  }

  const questions = await getSavedQuestions({
    clerkId: userId,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-11 flex flex-col justify-between gap-5 sm:flex-row sm:items-center ">
        <LocalSearch
          className="flex-1"
          placeholder="Search for amazing people"
          route="/community"
          img="/assets/icons/search.svg"
          imgSide="left"
        />
        <Filters
          filters={QuestionFilters}
          className="min-h-14 sm:min-w-[170px]"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6 ">
        {questions && questions.length > 0 ? (
          questions.map((question: any) => (
            <QuestionCard key={question._id} {...question} />
          ))
        ) : (
          <NoResultsFound
            title="No saved questions found"
            description="You can save questions to read them later. Start saving questions now!"
            link="/"
            linkText="Explore Questions"
          />
        )}
      </div>
    </>
  );
};

export default page;
