import dynamic from "next/dynamic";

import Metric from "@/components/shared/Metric";
import { getQuestionById } from "@/lib/data/questions";
import { humanizeDate, humanizeNumber } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import TagBadge from "@/components/shared/TagBadge";
import AnswerForm from "../_components/AnswerForm";

const HtmlParser = dynamic(() => import("@/components/shared/HtmlParser"), {
  ssr: false,
});

interface Props {
  params: {
    id: string;
  };
}

const page = async ({ params: { id } }: Props) => {
  const question = await getQuestionById(id);
  const { title, description, tags, author, answers, views, createdAt } =
    question;

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/prfile/${author.clerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={author.profile.avatar}
              alt={author.profile.name}
              width={22}
              height={22}
              className="rounded-full"
            />
            <p className="paragraph-semibold text-dark300_light700 ">
              {author.profile.name}
            </p>
          </Link>
          <div className="flex justify-end">Voting</div>
        </div>
        <h1 className="h2-bold text-dark200_light900 mt-3.5 w-full text-left">
          {title}
        </h1>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          textStyles="small-medium text-dark400_light800"
          img="/assets/icons/clock.svg"
          alt="clock"
          text=""
          value={`asked ${humanizeDate(createdAt)}`}
        />
        <Metric
          textStyles="small-medium text-dark400_light800"
          img="/assets/icons/message.svg"
          alt="message"
          text="Answers"
          value={humanizeNumber(answers.length)}
        />
        <Metric
          textStyles="small-medium text-dark400_light800"
          img="/assets/icons/eye.svg"
          alt="eye"
          text="Views"
          value={humanizeNumber(views)}
        />
      </div>

      <HtmlParser data={description} />

      <div className="mt-8 flex flex-wrap gap-2">
        {tags.map((tag: any) => (
          <TagBadge key={tag} {...tag} />
        ))}
      </div>

      <AnswerForm />
    </>
  );
};

export default page;
