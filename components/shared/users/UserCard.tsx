import { Badge } from "@/components/ui/badge";
import { getUserRelatedTags } from "@/lib/data/tag";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import TagBadge from "../TagBadge";

interface Props {
  _id: string;
  clerkId: string;
  username: string;
  profile: {
    name: string;
    avatar: string;
    bio: string;
  };
}

const UserCard = async ({ clerkId, profile, username }: Props) => {
  const tags = await getUserRelatedTags({ userId: clerkId });

  return (
    <div className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px] ">
      <div className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center gap-3 rounded-2xl border p-8">
        <Link href={`/profile/${clerkId}`}>
          <Image
            src={profile.avatar}
            alt={profile.name}
            width={100}
            height={100}
            className="rounded-full"
          />
        </Link>
        <div className="mt-4 text-center">
          <Link href={`/profile/${clerkId}`}>
            <h3 className="h3-bold text-dark200_light900 line-clamp-1">
              {profile.name}
            </h3>
          </Link>
          <Link href={`/profile/${clerkId}`}>
            <p className="body-regular text-dark500_light500 mt-2 line-clamp-1">
              @{username}
            </p>
          </Link>
        </div>

        <div className="mt-5">
          {tags.length > 0 ? (
            <div className="flex items-center gap-2">
              {tags.map((tag) => (
                <TagBadge key={tag._id} _id={tag._id} name={tag.name} />
              ))}
            </div>
          ) : (
            <Badge>No tags</Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
