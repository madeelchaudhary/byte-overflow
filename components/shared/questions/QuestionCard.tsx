import Link from "next/link";
import React from "react";
import TagBadge from "../TagBadge";
import Metric from "../Metric";
import { humanizeDate, humanizeNumber } from "@/lib/utils";
import { QuestionData } from "@/lib/types";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteActions from "../EditDeleteActions";

interface Props extends QuestionData {
  clerkId?: string | null;
}

const QuestionCard = ({
  _id,
  clerkId,
  title,
  tags,
  answers,
  author,
  upvotes,
  views,
  createdAt,
}: Props) => {
  const showActionsButtons = clerkId && clerkId === author.clerkId;

  return (
    <div className="card-wrapper rounded-xl p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 inline-block sm:hidden">
            {humanizeDate(createdAt)}
          </span>
          <Link href={`/question/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>

        <SignedIn>
          {showActionsButtons && (
            <EditDeleteActions type="question" itemId={_id} />
          )}
        </SignedIn>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <TagBadge {...tag} key={tag._id} />
        ))}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          textStyles="body-medium text-dark400_light700"
          img={author.profile.avatar || "/assets/icons/avatar.svg"}
          alt="user"
          text={` asked ${humanizeDate(createdAt)}`}
          value={author.profile.name}
          href={`/profile/${author.clerkId}`}
          isAuthor
        />
        <Metric
          textStyles="small-medium text-dark400_light800"
          img="/assets/icons/like.svg"
          alt="Upvotes"
          text="Upvotes"
          value={humanizeNumber(upvotes.length)}
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
    </div>
  );
};

export default QuestionCard;
