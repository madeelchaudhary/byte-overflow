import NoResultsFound from "@/components/shared/NoResultsFound";
import QuestionCard from "@/components/shared/questions/QuestionCard";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { getQuestionsByTagId } from "@/lib/data/tag";
import { notFound } from "next/navigation";

interface Props {
  searchParams: {
    [key: string]: any;
  };
  params: {
    id: string;
  };
}

const page = async ({ params: { id }, searchParams }: Props) => {
  const q = searchParams.q || "";
  const result = await getQuestionsByTagId({ tagId: id, search: q });

  if (!result) return notFound();

  const { questions, tagTitle } = result;

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">
        Questions related to {tagTitle}
      </h1>

      <div className="mt-11 w-full">
        <LocalSearch
          className="flex-1"
          placeholder="Search for amazing people"
          route="/community"
          img="/assets/icons/search.svg"
          imgSide="left"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6 ">
        {questions && questions.length > 0 ? (
          questions.map((question: any) => (
            <QuestionCard key={question._id} {...question} />
          ))
        ) : (
          <NoResultsFound
            title="No questions found"
            description="There are no questions related to this tag. Start exploring other tags!"
            link="/tags"
            linkText="Explore Tags"
          />
        )}
      </div>
    </>
  );
};

export default page;
