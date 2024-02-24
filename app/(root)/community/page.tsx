import NoResultsFound from "@/components/shared/NoResultsFound";
import PaginationMenu from "@/components/shared/PaginationMenu";
import Filters from "@/components/shared/filter/Filters";
import LocalSearch from "@/components/shared/search/LocalSearch";
import UserCard from "@/components/shared/users/UserCard";
import { UserFilters } from "@/constants/filters";
import { getUsers } from "@/lib/data/user";

interface Props {
  searchParams: {
    [key: string]: any;
  };
}

const page = async ({ searchParams }: Props) => {
  const q = searchParams.q || "";
  const filter = searchParams.filter || "";
  const page = searchParams.page ? Number(searchParams.page) : 1;

  const result = await getUsers({ search: q, filter, page });
  const users = result.users;

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>

      <div className="mt-11 flex flex-col justify-between gap-5 sm:flex-row sm:items-center ">
        <LocalSearch
          className="flex-1"
          placeholder="Search for amazing people"
          route="/community"
          img="/assets/icons/search.svg"
          imgSide="left"
        />
        <Filters filters={UserFilters} className="min-h-14 sm:min-w-[170px]" />
      </div>

      <section className="mt-12 flex flex-wrap gap-4 ">
        {users.length > 0 ? (
          users.map((user) => <UserCard key={user._id} {...user} />)
        ) : (
          <NoResultsFound
            title="No users found"
            description="We couldn't find any users matching your search"
            link="/sign-up"
            linkText="Sign up to be the first!"
          />
        )}
      </section>

      <div className="mt-10">
        <PaginationMenu total={result.totalUsers} />
      </div>
    </>
  );
};

export default page;
