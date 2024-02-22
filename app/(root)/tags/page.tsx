import NoResultsFound from "@/components/shared/NoResultsFound";
import Filters from "@/components/shared/filter/Filters";
import LocalSearch from "@/components/shared/search/LocalSearch";
import TagCard from "@/components/shared/tags/TagCard";
import { TagFilters } from "@/constants/filters";
import { getTagsWithQuestionsCount } from "@/lib/data/tag";

interface Props {
  searchParams: {
    [key: string]: any;
  };
}

const page = async ({ searchParams }: Props) => {
  const q = searchParams.q || "";
  const filter = searchParams.filter || "";
  const tags = await getTagsWithQuestionsCount({ search: q, filter });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Tags</h1>

      <div className="mt-11 flex flex-col justify-between gap-5 sm:flex-row sm:items-center ">
        <LocalSearch
          className="flex-1"
          placeholder="Search for tags..."
          route="/tags"
          img="/assets/icons/search.svg"
          imgSide="left"
        />
        <Filters filters={TagFilters} className="min-h-14 sm:min-w-[170px]" />
      </div>

      <section className="mt-12 flex flex-wrap gap-4 ">
        {tags.length > 0 ? (
          tags.map((tag) => <TagCard key={tag._id} {...tag} />)
        ) : (
          <NoResultsFound
            title="No tags found"
            description="We couldn't find any tags matching your search"
            link="/ask"
            linkText="Ask a question to create a tag"
          />
        )}
      </section>
    </>
  );
};

export default page;
