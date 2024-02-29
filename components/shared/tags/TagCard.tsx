import Link from "next/link";
import React from "react";

interface TagCardProps {
  _id: string;
  name: string;
  description: string;
  questionsCount: number;
}

const TagCard = ({ _id, name, description, questionsCount }: TagCardProps) => {
  return (
    <Link
      href={`/tags/${_id}`}
      className="shadow-light100_darknone w-full max-xs:min-w-full sm:w-[260px]"
    >
      <div className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 ">
        <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
          <h3 className="text-dark300_light900 paragraph-semibold">{name}</h3>
        </div>
        <p className="text-dark400_light500 small-medium mt-3.5">
          <span className="body-semibold primary-text-gradient mr-2.5">
            {questionsCount}+
          </span>{" "}
          Questions
        </p>
        <p className="text-dark400_light500 small-medium mt-3.5 line-clamp-1">
          {description}
        </p>
      </div>
    </Link>
  );
};

export default TagCard;
