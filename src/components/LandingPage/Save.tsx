import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function Save() {
  return (
    <section className="flex h-full bg-[#101827] py-28">
      <div className="container flex flex-col items-center justify-center gap-10 text-white lg:flex-row lg:justify-between">
        <div className="space-y-5 text-center lg:text-start">
          <h1 className="text-2xl font-extrabold uppercase sm:text-4xl md:text-7xl">
            Travel more, save more
          </h1>
          <p className="text-2xl font-bold max-lg:px-5 md:text-4xl">
            Tramona is the future of travel booking
          </p>
        </div>

        {/* <Link href="/sign-up">Create an Account</Link> */}

        <Button
          variant="outline"
          className="border border-[#EC4899] bg-[#EC4899] p-6 text-sm  font-bold text-white transition duration-300 ease-in-out md:text-2xl"
        >
          Create an account
        </Button>
      </div>
    </section>
  );
}
