import HtmlParser from "@/components/shared/HtmlParser";
import PaginationMenu from "@/components/shared/PaginationMenu";
import Votes from "@/components/shared/Votes";
import Filters from "@/components/shared/filter/Filters";
import { AnswerFilters } from "@/constants/filters";
import { getAnswers } from "@/lib/data/answers";
import { humanizeDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  questionId: string;
  userId?: string;
  searchParams: {
    [key: string]: any;
  };
}

const AllAnswers = async ({ questionId, userId, searchParams }: Props) => {
  const filter = searchParams.filter || "";
  const page = searchParams.page ? Number(searchParams.page) : 1;

  const result = await getAnswers({ questionId, filter, page });
  const { answers, totalAnswers } = result;

  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">{totalAnswers} Answers</h3>
        <Filters filters={AnswerFilters} />
      </div>

      <div>
        {answers.map((answer: any) => {
          return (
            <div key={answer._id} className="light-border border-b py-10">
              <div className="flex items-center justify-between">
                <div className="mb-8 flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                  <Link
                    href={`/profile/${answer.author.clerkId}`}
                    className="flex flex-1 items-start gap-1 sm:items-center"
                  >
                    <Image
                      src={answer.author.profile.avatar}
                      alt={answer.author.profile.name}
                      width={18}
                      height={18}
                      className="rounded-full object-cover max-sm:mt-0.5"
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <p className="body-semibold text-dark300_light700">
                        {answer.author.profile.name}
                      </p>
                      <p className="small-regular text-light400_light500 ml-1 mt-0.5 line-clamp-1">
                        <span className="max-sm:hidden">- </span>
                        answered {humanizeDate(answer.createdAt)}
                      </p>
                    </div>
                  </Link>
                  <div className="flex justify-end">
                    <Votes
                      type="answer"
                      itemId={answer._id}
                      upvotes={answer.upvotes}
                      downvotes={answer.downvotes}
                      userId={userId}
                    />
                  </div>
                </div>
              </div>
              <HtmlParser data={answer.description} />
            </div>
          );
        })}
      </div>

      <div className="mt-10">
        <PaginationMenu total={totalAnswers} />
      </div>
    </div>
  );
};

export default AllAnswers;
