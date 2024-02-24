"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useSearchParams } from "next/navigation";
import { generatePagination } from "@/lib/utils";
import clsx from "clsx";
import { PAGE_SIZE } from "@/constants";

interface Props {
  total: number;
  pageSize?: number;
}

const PaginationMenu = ({ total, pageSize = PAGE_SIZE }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const totalPages = Math.ceil(total / pageSize);
  const pages = generatePagination(currentPage, totalPages);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination className="justify-end">
      <PaginationContent className="gap-2">
        <PaginationPrevious
          className={clsx(
            "light-border-2 text-dark200_light800 body-medium border",
            currentPage <= 1 && "pointer-events-none cursor-not-allowed",
            currentPage > 1 && "btn"
          )}
          href={currentPage > 1 ? createPageURL(currentPage - 1) : ""}
        ></PaginationPrevious>
        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <PaginationItem key={index}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={page}>
              <PaginationLink
                href={createPageURL(page)}
                isActive={currentPage === page}
                className={clsx(
                  "light-border-2 text-dark200_light800 body-medium border",
                  currentPage === page &&
                    "primary-gradient pointer-events-none border-primary-500 text-light-900"
                )}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationNext
          className={clsx(
            "light-border-2 text-dark200_light800 body-medium border",
            currentPage >= totalPages &&
              "pointer-events-none cursor-not-allowed",
            currentPage < totalPages && "btn"
          )}
          href={currentPage < totalPages ? createPageURL(currentPage + 1) : ""}
        ></PaginationNext>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationMenu;
