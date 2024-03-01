import { BADGE_CRITERIA, BadgeCriteriaKey, Badges } from "@/constants/badge";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function humanizeDate(date: Date | string | number) {
  const now = new Date();
  date = typeof date === "object" ? date : new Date(date);
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  } else if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (days < 7) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (weeks < 4) {
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  } else if (months < 12) {
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else {
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }
}

export function humanizeNumber(num: number) {
  if (num < 1000) {
    return num;
  } else if (num < 1000000) {
    return `${Math.floor(num / 1000)}k`;
  } else if (num < 1000000000) {
    return `${Math.floor(num / 1000000)}m`;
  } else {
    return `${Math.floor(num / 1000000000)}b`;
  }
}

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

export const countBadges = (
  criteria: Array<{ type: BadgeCriteriaKey; count: number }>
) => {
  const badges: Badges = {
    BRONZE: 0,
    SILVER: 0,
    GOLD: 0,
  };

  for (const { type, count } of criteria) {
    if (count >= BADGE_CRITERIA[type].GOLD) {
      badges.GOLD++;
    } else if (count >= BADGE_CRITERIA[type].SILVER) {
      badges.SILVER++;
    } else if (count >= BADGE_CRITERIA[type].BRONZE) {
      badges.BRONZE++;
    }
  }

  return badges;
};

export function getAIAnswerPrompt(title: string, description: string) {
  return `
  Below is the question that needs to be answered:

  Title: ${title}
  Explanation in WYSIWYG format: ${description}

  Please provide an answer to the question.

  For example, you can provide a code snippet, a link to a resource, or a brief explanation.

  Output format: markdown or MD
`;
}
