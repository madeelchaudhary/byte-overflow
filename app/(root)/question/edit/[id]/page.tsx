import { auth } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";

import QuestionForm from "@/app/(root)/ask/_components/QuestionForm";
import { getQuestionById } from "@/lib/data/questions";

const page = async ({ params: { id } }: { params: { id: string } }) => {
  const { userId } = auth();

  if (!userId) return redirect("/sign-in");

  const result = await getQuestionById(id);

  if (!result) return notFound();

  const { question } = result;

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>

      <div className="mt-9">
        <QuestionForm
          type="edit"
          question={{
            _id: question._id,
            title: question.title,
            description: question.description,
            tags: question.tags.map((tag: any) => tag.name),
          }}
        />
      </div>
    </>
  );
};

export default page;
