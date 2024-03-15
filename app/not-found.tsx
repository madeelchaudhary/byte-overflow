import NoResultsFound from "@/components/shared/NoResultsFound";
import Navbar from "@/components/shared/navbar";
import LeftSideBar from "@/components/shared/sidebars/LeftSidebar";
import RightSideBar from "@/components/shared/sidebars/RightSidebar";
import { Toaster } from "@/components/ui/toaster";

const notFound = () => {
  return (
    <div className="background-light850_dark100 relative">
      <Navbar />
      <main className="flex">
        <LeftSideBar />
        <section className="flex min-h-screen grow flex-col justify-center px-6 pb-14 pt-36 sm:px-14 md:pb-6">
          <h1 className="sr-only">Page Not Found</h1>
          <NoResultsFound
            title="Page Not Found"
            description="Oops! The page you are looking for does not exist. Please check the URL or go back to the home page."
            link="/"
            linkText="Go back to home"
          />
        </section>
        <RightSideBar />
      </main>
      <Toaster />
    </div>
  );
};

export default notFound;
