import { humanizeNumber } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface Props {
  totalQuestions: number;
  totalAnswers: number;
}

const UserStats = ({ totalAnswers, totalQuestions }: Props) => {
  return (
    <div className="mt-10">
      <h2 className="h3-semibold text-dark200_light900">Stats</h2>

      <div className="mt-5 grid gap-5 xs:grid-cols-2 md:grid-cols-4">
        <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-300">
          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {humanizeNumber(totalQuestions)}
            </p>
            <p className="body-medium text-dark400_light700">Questions</p>
          </div>
          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {humanizeNumber(totalAnswers)}
            </p>
            <p className="body-medium text-dark400_light700">Answers</p>
          </div>
        </div>

        <StatCard
          title="Gold Badges"
          value={0}
          img="/assets/icons/gold-medal.svg"
        />
        <StatCard
          title="Silver Badges"
          value={0}
          img="/assets/icons/silver-medal.svg"
        />
        <StatCard
          title="Bronze Badges"
          value={0}
          img="/assets/icons/bronze-medal.svg"
        />
      </div>
    </div>
  );
};

export default UserStats;

interface StatCardProps {
  title: string;
  value: number;
  img: string;
}

function StatCard({ title, value, img }: StatCardProps) {
  return (
    <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-start gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-300">
      <Image src={img} alt={title} width={40} height={50} />
      <div>
        <p className="paragraph-semibold text-dark200_light900">
          {humanizeNumber(value)}
        </p>
        <p className="body-medium text-dark400_light700">{title}</p>
      </div>
    </div>
  );
}
