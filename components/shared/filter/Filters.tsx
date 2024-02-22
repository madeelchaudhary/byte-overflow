"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Props {
  filters: {
    name: string;
    value: string;
  }[];
  className?: string;
  wrapperClassName?: string;
}

const Filters = ({ filters, className, wrapperClassName }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const selected = searchParams.get("filter");

  function handleFilter(value: string) {
    const params = new URLSearchParams(searchParams);
    if (value === selected) {
      params.delete("filter");
    } else {
      params.set("filter", value);
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className={`relative ${wrapperClassName}`}>
      <Select
        value={selected || ""}
        onValueChange={(value) => handleFilter(value)}
      >
        <SelectTrigger
          className={`body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5 ${className}`}
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a Filter" />
          </div>
        </SelectTrigger>
        <SelectContent className="rounded border bg-light-900 py-2 dark:border-dark-400 dark:bg-dark-300 dark:text-light-900">
          {filters.map((filter) => (
            <SelectItem key={filter.value} value={filter.value}>
              {filter.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filters;
