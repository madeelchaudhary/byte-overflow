import Navbar from "@/components/shared/navbar";
import LeftSideBar from "@/components/shared/sidebars/LeftSidebar";
import RightSideBar from "@/components/shared/sidebars/RightSidebar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="background-light850_dark100 relative">
      <Navbar />
      <main className="flex">
        <LeftSideBar />
        <section className="flex min-h-screen grow flex-col px-6 pb-14 pt-36 sm:px-14 md:pb-6">
          {children}
        </section>
        <RightSideBar />
      </main>
      {/* Toaster */}
    </div>
  );
};

export default layout;
