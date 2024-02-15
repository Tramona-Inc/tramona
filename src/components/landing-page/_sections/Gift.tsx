import React from "react";
import { Button } from "../../ui/button";
import Image from "next/legacy/image";
import Link from "next/link";

export default function Gift() {
  return (
    <section className="relative h-full bg-[#DBE9FE] pb-20 pt-10">
      <div className="container flex flex-col items-center space-y-14 py-20">
        <div className="text-center text-4xl font-extrabold uppercase text-[#101827] sm:text-6xl lg:text-8xl">
          Gift your friends Tramona and earn from their vacations
        </div>

        <div className="flex max-w-[200px] justify-center">
          <Link href="/program">
            <Button
              variant="outline"
              className="border border-black px-9 py-7 text-sm font-bold text-black transition duration-300 ease-in-out md:text-2xl"
            >
              I Want to Make Money 💲🤑💲
            </Button>
          </Link>
        </div>
      </div>

      <div className="absolute -left-10 bottom-0 h-[200px] w-[200px] md:left-0 md:h-[250px] md:w-[250px] lg:h-[350px] lg:w-[350px]">
        <Image
          src="/assets/images/landing-page-props/paper_money.png"
          layout="fill"
          objectFit="contain"
          alt="image dollar"
        />
      </div>
    </section>
  );
}
