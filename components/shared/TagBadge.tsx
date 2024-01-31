import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";

interface Props {
  _id: string;
  name: string;
  totalQuestions?: number;
  renderCount?: boolean;
}

const TagBadge = ({ _id, name, totalQuestions, renderCount }: Props) => {
  return (
    <Link
      className="flex items-center justify-between gap-2"
      href={`/tags/${_id}`}
    >
      <Badge className="subtle-medium text-light400_light500 background-light800_dark300 rounded-md border-none px-4 py-2">
        {name}
      </Badge>
      {renderCount && (
        <p className="small-medium text-dark500_light700">{totalQuestions}</p>
      )}
    </Link>
  );
};

export default TagBadge;
