import Image from "next/image";
import Link from "next/link";
import TagBadge from "../TagBadge";
import { getHotQuestions } from "@/lib/data/questions";
import { getHotTags } from "@/lib/data/tag";

const RightSideBar = async () => {
  const hotQuestions = await getHotQuestions({ page: 1, pageSize: 5 });

  const popularTags = await getHotTags({ page: 1, pageSize: 5 });

  return (
    <aside className="light-border background-light900_dark200 custom-scrollbar sticky right-0 top-0 hidden h-screen flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none lg:w-[355px] xl:flex">
      <div className="flex flex-1 flex-col gap-6">
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions.map((question) => (
            <Link
              href={`/question/${question._id}`}
              key={question._id}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="body-medium text-dark500_light700">
                {question.title}
              </p>
              <Image
                src={"/assets/icons/chevron-right.svg"}
                width={20}
                height={20}
                alt="Arrow Right"
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 flex flex-col gap-4">
          {popularTags.map((tag) => (
            <TagBadge key={tag._id} renderCount {...tag} />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RightSideBar;
