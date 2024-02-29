import { Skeleton } from "@/components/ui/skeleton";

const loading = () => {
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-11 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <Skeleton className="h-14 flex-1 max-sm:min-w-full max-sm:flex-auto" />
        <Skeleton className="h-14 max-sm:min-w-full sm:min-w-[170px]" />
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
