import { getUserQuestions } from "@/lib/data/user";
import React from "react";
import QuestionCard from "../questions/QuestionCard";
import NoResultsFound from "../NoResultsFound";

interface Props {
  userId: string;
  clerkId: string | null;
}

const ProfileQuestionTab = async ({ userId }: Props) => {
  const questions = await getUserQuestions({ userId });
  return (
    <>
      {questions.length > 0 ? (
        questions.map((question) => (
          <QuestionCard key={question._id} {...question} />
        ))
      ) : (
        <NoResultsFound
          title="Oops! No questions found"
          description="You haven't asked any questions yet. Go ahead and ask your first question!"
          link="/ask"
          linkText="Ask a question"
        />
      )}
    </>
  );
};

export default ProfileQuestionTab;
