import { getUserAnswers } from "@/lib/data/user";
import NoResultsFound from "../NoResultsFound";
import AnswerCard from "../answers/AnswerCard";
import PaginationMenu from "../PaginationMenu";

interface Props {
  userId: string;
  clerkId: string | null;
  searchParams: {
    [key: string]: any;
  };
}

const ProfileAnswerTab = async ({ userId, clerkId, searchParams }: Props) => {
  const page = searchParams.aPage ? Number(searchParams.aPage) : 1;

  const { answers, totalAnswers } = await getUserAnswers({ userId, page });

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
          link="/"
          linkText="Answer a question"
        />
      )}

      <div className="mt-10">
        <PaginationMenu total={totalAnswers} queryTerm="aPage" />
      </div>
    </>
  );
};

export default ProfileAnswerTab;
