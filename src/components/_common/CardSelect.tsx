export default function CardSelect({
  children,
  title,
  text,
}: {
  children: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex flex-row items-center gap-5 rounded-[12px] border-[2px] p-5 sm:p-8 lg:p-10">
      <div className="flex w-16 justify-center">{children}</div>
      <div>
        <h1 className="font-semibold md:text-2xl">{title}</h1>
        <p className="text-sm text-muted-foreground md:text-lg">{text}</p>
      </div>
    </div>
  );
}
