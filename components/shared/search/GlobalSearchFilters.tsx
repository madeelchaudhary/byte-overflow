import { usePathname, useSearchParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { GlobalSearchFilters as SearchFIlters } from "@/constants/filters";

const GlobalSearchFilters = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const filter = searchParams.get("gf");

  const handleFilter = (filter: string) => {
    const params = new URLSearchParams(searchParams);
    if (filter && filter === params.get("gf")) {
      params.delete("gf");
    } else if (filter) {
      params.set("gf", filter);
    } else {
      params.delete("gf");
    }
    const url = `${pathname}?${params.toString()}`;
    router.push(url);
  };

  return (
    <div className="flex items-center gap-5 px-5">
      <p className="text-dark400_light900 body-medium">Filter: </p>
      <div className="flex gap-3">
        {SearchFIlters.map((item) => (
          <Button
            onClick={() => handleFilter(item.value)}
            key={item.value}
            className={`small-medium light-border-2 h-auto w-auto rounded-2xl capitalize ${
              item.value === filter
                ? "bg-primary-500 text-light-900"
                : "bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500 dark:text-light-800 dark:hover:text-primary-500"
            } transition-colors`}
          >
            {item.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GlobalSearchFilters;
