import { Skeleton } from "@/components/ui/skeleton";

const loading = () => {
  return (
    <>
      <Skeleton className="h-[42px] w-60" />

      <div className="mt-11 w-full">
        <Skeleton className="h-14 w-full" />
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
