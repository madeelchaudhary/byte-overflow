import dynamic from "next/dynamic";

import Metric from "@/components/shared/Metric";
import TagBadge from "@/components/shared/TagBadge";
import Votes from "@/components/shared/Votes";
import { getUserById } from "@/lib/actions/user";
import { getQuestionById } from "@/lib/data/questions";
import { humanizeDate, humanizeNumber } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import AllAnswers from "../_components/AllAnswers";
import AnswerForm from "../_components/AnswerForm";

const HtmlParser = dynamic(() => import("@/components/shared/HtmlParser"), {
  ssr: false,
});

interface Props {
  params: {
    id: string;
  };
  searchParams: {
    [key: string]: any;
  };
}

const page = async ({ params: { id }, searchParams }: Props) => {
  const { userId } = auth();

  const [question, user] = await Promise.all([
    getQuestionById(id),
    userId ? getUserById(userId) : null,
  ]);

  const filter = searchParams.filter || "";

  const {
    _id,
    title,
    description,
    tags,
    author,
    upvotes,
    downvotes,
    totalAnswers,
    views,
    createdAt,
  } = question;

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
            <p className="paragraph-semibold text-dark300_light700">
              {author.profile.name}
            </p>
          </Link>
          <div className="flex justify-end">
            <Votes
              type="question"
              itemId={_id}
              userId={user?._id?.toString()}
              upvotes={upvotes}
              downvotes={downvotes}
              hasSaved={user ? user.saved.includes(_id) : undefined}
            />
          </div>
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
          value={humanizeNumber(totalAnswers)}
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

      <AllAnswers
        questionId={id}
        totalAnswers={totalAnswers}
        userId={user?._id?.toString()}
        filter={filter}
      />

      <AnswerForm />
    </>
  );
};

export default page;
