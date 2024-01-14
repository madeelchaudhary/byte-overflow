import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <main className="flex-center min-h-screen">{children}</main>;
};

export default layout;
