"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { deleteAnswer } from "@/lib/actions/answers";
import { deleteQuestion } from "@/lib/actions/questions";
import { Button } from "../ui/button";

interface Props {
  type: "question" | "answer";
  itemId: string;
}

const EditDeleteActions = ({ type, itemId }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  async function handleDelete() {
    if (type === "question") {
      // delete question
      await deleteQuestion(itemId, pathname);
    } else {
      // delete answer
      await deleteAnswer(itemId, pathname);
    }
  }

  function handleEdit() {
    if (type === "question") {
      // edit question
      router.push(`/question/edit/${itemId}`);
    }
  }

  return (
    <div className="flex items-center justify-end gap-3 max-sm:w-full">
      {type === "question" && (
        <Button className="h-auto w-auto p-0" onClick={() => handleEdit()}>
          <Image
            src="/assets/icons/edit.svg"
            alt="edit icon"
            width={14}
            height={14}
            className="object-contain"
          />
          <span className="sr-only">Edit</span>
        </Button>
      )}

      <Button className="h-auto w-auto p-0" onClick={() => handleDelete()}>
        <Image
          src="/assets/icons/trash.svg"
          alt="delete icon"
          width={14}
          height={14}
          className="object-contain"
        />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  );
};

export default EditDeleteActions;
