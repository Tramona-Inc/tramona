import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type FeatureItem = {
  id: number;
  title: string;
  image: string;
};

const featureItems: FeatureItem[] = [
  {
    id: 0,
    title: "24/7 Support",
    image: "/assets/images/why-list/support.png",
  },
  {
    id: 1,
    title: "Secure payments",
    image: "/assets/images/why-list/secure-payments.png",
  },
  {
    id: 2,
    title: "Optional Security Deposit",
    image: "/assets/images/why-list/security.png",
  },
];

export const Features = () => {
  return (
    <section className="py-12">
      <ul className="flex flex-wrap justify-center gap-8">
        {featureItems.map((item) => (
          <li
            key={item.id}
            className="w-72 overflow-hidden rounded-lg bg-white shadow-lg"
          >
            <span className="relative block h-48">
              <Image
                src={item.image}
                objectFit="cover"
                layout="fill"
                alt={item.title}
              />
            </span>
            <span className="p-4 text-center">
              <h2 className="text-lg font-semibold">{item.title}</h2>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-center text-lg font-bold">
        <Link href="">
          <Button size="lg" className="bg-primaryGreen text-white">
            Demo
          </Button>
        </Link>
      </div>
    </section>
  );
};