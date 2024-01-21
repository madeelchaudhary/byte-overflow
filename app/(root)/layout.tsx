import Navbar from "@/components/shared/navbar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="background-light850_dark100 relative">
      <Navbar />
      <main className="flex">
        <aside>Left Sidebar</aside>
        <section className="flex min-h-screen grow flex-col px-6 pb-14 pt-36 sm:px-14 md:pb-6">
          {children}
        </section>
        <aside>Right Sidebar</aside>
      </main>
      Toaster
    </div>
  );
};

export default layout;
