import { getUserAnswers } from "@/lib/data/user";
import NoResultsFound from "../NoResultsFound";
import AnswerCard from "../answers/AnswerCard";

interface Props {
  userId: string;
  clerkId: string | null;
}

const ProfileAnswerTab = async ({ userId, clerkId }: Props) => {
  const answers = await getUserAnswers({ userId });

  return (
    <>
      {answers.length > 0 ? (
        answers.map((answer) => (
          <AnswerCard key={answer._id} {...answer} clerkId={clerkId} />
        ))
      ) : (
        <NoResultsFound
          title="Oops! No answers found"
          description="You haven't answered any questions yet. Go ahead and answer your first question!"
          link="/ask"
          linkText="Answer a question"
        />
      )}
    </>
  );
};

export default ProfileAnswerTab;
