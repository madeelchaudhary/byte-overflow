import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  img: string;
  title: string;
  href?: string;
}

const ProfileInfoItem = ({ img, title, href }: Props) => {
  return (
    <li className="flex-center gap-1">
      <Image src={img} alt={title} width={20} height={20} />
      {href && (
        <Link
          href={href}
          target="_blank"
          className="paragraph-medium text-accent-blue"
        >
          {title}
        </Link>
      )}
      <p className="paragraph-medium text-dark400_light700">{title}</p>
    </li>
  );
};

export default ProfileInfoItem;
