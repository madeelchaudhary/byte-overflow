"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { humanizeNumber } from "@/lib/utils";
import {
  downvoteAnswer,
  downvoteQuestion,
  upvoteAnswer,
  upvoteQuestion,
} from "@/lib/actions/votes";
import { saveQuestion } from "@/lib/actions/user";
import { viewQuestion } from "@/lib/actions/interaction";
import { toast } from "../ui/use-toast";

interface Props {
  type: "question" | "answer";
  itemId: string;
  upvotes: string[];
  downvotes: string[];
  userId?: string;
  hasSaved?: boolean;
}

const Votes = ({
  type,
  itemId,
  upvotes,
  downvotes,
  userId,
  hasSaved,
}: Props) => {
  const hasUpvoted = upvotes.includes(userId || "");
  const hasDownvoted = downvotes.includes(userId || "");

  async function handleVote(action: "upvote" | "downvote") {
    if (!userId)
      return toast({
        title: "You need to be logged in to vote",
        variant: "destructive",
      });

    try {
      let result: { error: string; status: number } | void;
      if (type === "question") {
        if (action === "upvote") {
          result = await upvoteQuestion(itemId, userId);
        }

        if (action === "downvote") {
          result = await downvoteQuestion(itemId, userId);
        }
      } else {
        if (action === "upvote") {
          result = await upvoteAnswer(itemId, userId);
        }

        if (action === "downvote") {
          result = await downvoteAnswer(itemId, userId);
        }
      }

      if (result! && result.error) {
        return toast({ title: result.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Something went wrong!", variant: "destructive" });
    }
  }

  async function handleSave() {
    if (!userId) {
      return toast({
        title: "You need to be logged in to save",
        variant: "destructive",
      });
    }

    try {
      const result = await saveQuestion(itemId, userId);

      if (result && result.error) {
        return toast({ title: result.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Something went wrong!", variant: "destructive" });
    }
  }

  useEffect(() => {
    if (type === "question") {
      viewQuestion({ questionId: itemId });
    }
  }, [type, itemId]);

  return (
    <div className="flex gap-5 ">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Button className="h-auto p-0" onClick={() => handleVote("upvote")}>
            <Image
              src={
                hasUpvoted
                  ? "/assets/icons/upvoted.svg"
                  : "/assets/icons/upvote.svg"
              }
              width={18}
              height={18}
              alt="Upvote"
            />
          </Button>
          <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {humanizeNumber(upvotes.length)}
            </p>
          </div>
        </div>

        <div className="flex-center gap-1.5">
          <Button className="h-auto p-0" onClick={() => handleVote("downvote")}>
            <Image
              src={
                hasDownvoted
                  ? "/assets/icons/downvoted.svg"
                  : "/assets/icons/downvote.svg"
              }
              width={18}
              height={18}
              alt="Downvote"
            />
          </Button>
          <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {humanizeNumber(downvotes.length)}
            </p>
          </div>
        </div>
      </div>

      {hasSaved !== undefined && (
        <Button className="h-auto p-0" onClick={() => handleSave()}>
          <Image
            src={
              hasSaved
                ? "/assets/icons/star-filled.svg"
                : "/assets/icons/star-red.svg"
            }
            width={18}
            height={18}
            alt="Save"
          />
        </Button>
      )}
    </div>
  );
};

export default Votes;
