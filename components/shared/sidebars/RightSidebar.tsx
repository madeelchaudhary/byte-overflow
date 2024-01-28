import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import TagBadge from "../TagBadge";

const RightSideBar = () => {
  const hotQuestions = [
    { _id: 1, title: "How to use Next.js with Tailwind CSS" },
    { _id: 2, title: "Case insensitive 'Contains[X]' in C#" },
    { _id: 3, title: "Django best practices for data migrations and testing" },
    { _id: 4, title: "Migration from AngularJS to Angular 12" },
    { _id: 5, title: "How to use Prisma Client in a REST API" },
  ];

  const popularTags = [
    { _id: 1, name: "javascript", totalQuestions: 123 },
    { _id: 2, name: "react", totalQuestions: 123 },
    { _id: 3, name: "typescript", totalQuestions: 123 },
    { _id: 4, name: "nextjs", totalQuestions: 123 },
    { _id: 5, name: "prisma", totalQuestions: 123 },
  ];

  return (
    <aside className="light-border background-light900_dark200 custom-scrollbar sticky right-0 top-0 hidden h-screen flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none lg:w-[355px] xl:flex">
      <div className="flex flex-1 flex-col gap-6">
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions.map((question) => (
            <Link
              href={`/questions/${question._id}`}
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
