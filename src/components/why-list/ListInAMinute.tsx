import Image from "next/image";

type Tab = {
  id: number;
  title: string;
  info: string;
  image: string;
};

const contents: Tab[] = [
  {
    id: 0,
    title: "Directly with Airbnb",
    info: "Instantly sign up with Airbnb Via our partner hospitable. This will redirect you to Airbnb and allow an effortless onboarding.",
    image: "/assets/images/host-welcome/1.jpeg",
  },
  {
    id: 1,
    title: "We sign you up",
    info: "Have any questions? Schedule a call and we will help onboard you and answer all questions in the meantime.",
    image: "/assets/images/host-welcome/3.png",
  },
];

export const ListInAMinute = () => {
  return (
    <section className="flex flex-col items-center gap-6 bg-[#f8f8f8] p-8">
      <h1 className="mb-8 text-center text-2xl font-semibold">
        List your property in under a minute with our simple sign-up process
      </h1>
      <ul className="flex list-none flex-wrap justify-center gap-8 p-0">
        {contents.map((content) => (
          <li
            key={content.id}
            className="flex w-[300px] flex-col items-center rounded-lg bg-white p-4 text-center shadow-md"
          >
            <span className="relative mb-4 block h-[200px] w-full overflow-hidden rounded-lg">
              <Image
                src={content.image}
                objectFit="cover"
                layout="fill"
                alt={content.title}
              />
            </span>
            <span>
              <h2 className="mb-2 text-lg font-bold">{content.title}</h2>
              <p className="text-sm text-[#666]">{content.info}</p>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};