import Link from "next/link";

import Filters from "@/components/shared/filter/Filters";
import TagFilter from "@/components/shared/filter/TagFilter";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import NoResultsFound from "@/components/shared/NoResultsFound";
import QuestionCard from "@/components/shared/questions/QuestionCard";

const questions = [
  {
    _id: "1",
    title: "How to implement authentication in a Next.js application?",
    tags: [
      { _id: "1", name: "Next.js" },
      { _id: "2", name: "Authentication" },
    ],
    answers: [],
    views: 56,
    upvotes: 10,
    author: { _id: "1", name: "John Doe", picture: "/avatars/john-doe.jpg" },
    created_at: new Date("2023-01-15"),
  },
  {
    _id: "2",
    title:
      "What is the best practice for handling state in React applications?",
    tags: [
      { _id: "3", name: "React" },
      { _id: "4", name: "State Management" },
    ],
    answers: [],
    views: 1002,
    upvotes: 25,
    author: {
      _id: "2",
      name: "Jane Smith",
      picture: "/avatars/jane-smith.jpg",
    },

    created_at: new Date("2023-02-22"),
  },
  {
    _id: "3",
    title: "How to deploy a Node.js application to AWS Lambda?",
    tags: [
      { _id: "5", name: "Node.js" },
      { _id: "6", name: "AWS Lambda" },
    ],
    answers: [],
    views: 38,
    upvotes: 8,
    author: {
      _id: "3",
      name: "Alice Johnson",
      picture: "/avatars/alice-johnson.jpg",
    },

    created_at: new Date("2023-03-10"),
  },
  // Add more example questions as needed
];

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

      <div className="mt-10 flex w-full flex-col gap-6 ">
        {questions.length > 2 ? (
          questions.map((question) => (
            <QuestionCard key={question._id} {...question} />
          ))
        ) : (
          <NoResultsFound />
        )}
      </div>
    </>
  );
}
