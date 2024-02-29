import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const loading = () => {
  return (
    <>
      <div className=" flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Link href="/ask" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>

      <div className="mt-11 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <Skeleton className="h-14 flex-1 max-sm:min-w-full max-sm:flex-auto" />
        <Skeleton className="h-14 max-sm:min-w-full sm:min-w-[170px] md:hidden" />
      </div>

      <div className="mt-10 hidden flex-wrap gap-3 md:flex">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-36" />
      </div>

      <section className="mt-10 flex w-full flex-col gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Skeleton key={i} className="h-44 w-full rounded-xl" />
        ))}
      </section>
    </>
  );
};

export default loading;
