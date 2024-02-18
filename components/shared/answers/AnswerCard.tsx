import Link from "next/link";

import Metric from "@/components/shared/Metric";
import { humanizeNumber, humanizeDate } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
// import EditDeleteAction from "../shared/EditDeleteAction";
import { AnswerData } from "@/lib/types";

interface Props extends AnswerData {
  clerkId: string | null;
}

const AnswerCard = ({
  clerkId,
  _id,
  question,
  author,
  upvotes,
  createdAt,
}: Props) => {
  const showActionsButtons = clerkId && clerkId === author.clerkId;

  return (
    <div className="card-wrapper rounded-[10px] px-11 py-9">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row ">
        <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
          {humanizeDate(createdAt)}
        </span>
        <Link href={`/question/${question._id}/#${_id}`}>
          <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
            {question.title}
          </h3>
        </Link>

        <SignedIn>
          {/* {showActionsButtons && (
            <EditDeleteAction type="Answer" itemId={JSON.stringify(_id)} />
          )} */}
        </SignedIn>
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          img={author.profile.avatar}
          alt="user avatar"
          value={author.profile.name}
          text={` • asked ${humanizeDate(createdAt)}`}
          href={`/profile/${author.clerkId}`}
          textStyles="body-medium text-dark400_light700"
          isAuthor
        />

        <div className="flex-center gap-3">
          <Metric
            img="/assets/icons/like.svg"
            alt="like icon"
            value={humanizeNumber(upvotes.length)}
            text=" Votes"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;
