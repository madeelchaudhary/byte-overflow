import NoResultsFound from "@/components/shared/NoResultsFound";

const page = () => {
  return (
    <>
      <h1 className="sr-only">Under construction</h1>

      <NoResultsFound
        title="Under construction"
        description="Oops! The page you are looking for is under construction. Please check back later."
        link="/"
        linkText="Go back to home"
      />
    </>
  );
};

export default page;
