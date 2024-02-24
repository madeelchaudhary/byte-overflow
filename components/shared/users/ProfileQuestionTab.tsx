import { getUserQuestions } from "@/lib/data/user";
import React from "react";
import QuestionCard from "../questions/QuestionCard";
import NoResultsFound from "../NoResultsFound";
import PaginationMenu from "../PaginationMenu";

interface Props {
  userId: string;
  clerkId: string | null;
  searchParams: {
    [key: string]: any;
  };
}

const ProfileQuestionTab = async ({ userId, clerkId, searchParams }: Props) => {
  const page = searchParams.qPage ? Number(searchParams.qPage) : 1;

  const result = await getUserQuestions({ userId, page });
  const { questions, totalQuestions } = result;
  return (
    <>
      {questions.length > 0 ? (
        questions.map((question) => (
          <QuestionCard key={question._id} {...question} clerkId={clerkId} />
        ))
      ) : (
        <NoResultsFound
          title="Oops! No questions found"
          description="You haven't asked any questions yet. Go ahead and ask your first question!"
          link="/ask"
          linkText="Ask a question"
        />
      )}

      <div className="mt-10">
        <PaginationMenu total={totalQuestions} queryTerm="qPage" />
      </div>
    </>
  );
};

export default ProfileQuestionTab;
