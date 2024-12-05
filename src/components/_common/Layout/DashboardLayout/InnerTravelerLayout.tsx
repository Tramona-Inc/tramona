import React from "react";

function InnerTravelerLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="min-h-screen-minus-header px-4 pb-footer-height pt-5">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center">
          <h1 className="flex-1 py-4 text-2xl font-bold tracking-tight text-black lg:text-4xl">
            {title}
          </h1>
        </header>
        {children}
      </div>
    </div>
  );
}

export default InnerTravelerLayout;
