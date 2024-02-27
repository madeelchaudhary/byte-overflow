import { SignedIn, auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import ProfileInfoItem from "@/components/shared/users/ProfileInfoItem";
import ProfileTabs from "@/components/shared/users/ProfileTabs";
import UserStats from "@/components/shared/users/UserStats";
import { Button } from "@/components/ui/button";
import { getUserInfo } from "@/lib/data/user";

interface Props {
  params: {
    id: string;
  };
  searchParams: {
    [key: string]: any;
  };
}

const page = async ({ params: { id }, searchParams }: Props) => {
  const { userId } = auth();

  const result = await getUserInfo(id);

  if (!result) return notFound();

  const { user, totalQuestions, totalAnswers, badges } = result;

  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 sm:flex-row">
          <Image
            src={user.profile.avatar}
            alt={user.profile.name}
            width={140}
            height={140}
            className="rounded-full object-cover"
          />

          <div className="mt-3">
            <h1 className="h2-bold text-dark100_light900">
              {user.profile.name}
            </h1>
            <p className="paragraph-regular text-dark200_light800">
              @{user.username}
            </p>

            <ul className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {user.profile.portfolio && (
                <ProfileInfoItem
                  img="/assets/icons/link.svg"
                  title="Portfolio"
                  href={user.profile.portfolio}
                />
              )}

              {user.profile.location && (
                <ProfileInfoItem
                  img="/assets/icons/location.svg"
                  title={user.profile.location}
                />
              )}

              <ProfileInfoItem
                img="/assets/icons/calendar.svg"
                title={user.createdAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              />
            </ul>

            {user.profile.bio && (
              <p className="text-dark400_light800 paragraph-regular mt-8">
                {user.profile.bio}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          <SignedIn>
            {userId === user.clerkId && (
              <Button
                asChild
                className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-44"
              >
                <Link href="/profile/edit">Edit Profile</Link>
              </Button>
            )}
          </SignedIn>
        </div>
      </div>

      <UserStats
        totalQuestions={totalQuestions}
        totalAnswers={totalAnswers}
        badges={badges}
      />

      <div className="mt-10 flex gap-10">
        <ProfileTabs
          searchParams={searchParams}
          userId={user._id}
          clerkId={userId}
        />
      </div>
    </>
  );
};

export default page;
