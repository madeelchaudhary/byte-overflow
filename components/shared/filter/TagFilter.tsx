"use client";
import { Button } from "@/components/ui/button";
import React from "react";

interface Props {
  filters: {
    name: string;
    value: string;
  }[];
  className?: string;
  wrapperClassName?: string;
}

const TagFilter = ({ filters, className, wrapperClassName }: Props) => {
  const selected = undefined;

  return (
    <div className={`flex flex-wrap gap-3 ${wrapperClassName}`}>
      {filters.map((filter) => (
        <Button
          key={filter.value}
          onClick={() => {}}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
            selected === filter.value
              ? "bg-primary-100 text-primary-500"
              : "bg-light-800 text-light-500 hover:bg-light-900 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-400"
          } ${className}`}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
};

export default TagFilter;
