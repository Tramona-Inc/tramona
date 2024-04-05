import React from "react";

export default function CardSelect({
  children,
  title,
  text,
  onClick,
  isSelected,
}: {
  children: React.ReactNode;
  title: string;
  text: string;
  onClick: () => void;
  isSelected: boolean;
}) {
  return (
    <div
      className={`flex flex-row items-center gap-5 rounded-[12px] border-[2px] p-5 transition-all hover:border-black sm:p-6 lg:p-7 ${
        isSelected ? "border-black" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex w-16 justify-center">{children}</div>
      <div>
        <h1 className="font-semibold md:text-xl">{title}</h1>
        <p className="text-sm text-muted-foreground md:text-lg">{text}</p>
      </div>
    </div>
  );
}
