import ProfileForm from "@/components/shared/users/ProfileForm";
import { getUserByClerkId } from "@/lib/data/user";
import { auth } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";

const page = async () => {
  const { userId } = auth();

  if (!userId) return redirect("/sign-in");

  const user = await getUserByClerkId(userId);

  if (!user) return notFound();

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>

      <div className="mt-9">
        <ProfileForm user={user} />
      </div>
    </>
  );
};

export default page;
