import Image from "next/legacy/image";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../ui/carousel";

export default function Reviews() {
  return (
    <section className="flex flex-col items-center space-y-3 p-20">
      <h1 className="text-center text-3xl font-extrabold md:text-5xl">
        Our Favorite Tramona Stories
      </h1>
      <p className="text-center text-sm md:text-xl">
        Here are some of our favorite stories from people who use Tramona to
        travel to this month!
      </p>

      <Carousel className="w-full max-w-4xl">
        <CarouselContent className="-ml-1 ">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="pl-1 md:basis-1/2 lg:basis-1/3"
            >
              <div className="p-1">
                <Card className="bg-[#D7F6E7]">
                  <CardContent className="aspect-square items-center justify-center p-6 ">
                    <div className="text-2xl font-semibold">
                      {/* {index + 1} */}
                      <div className="relative h-[250px]">
                        <Image
                          src="/assets/images/landing-page-props/review_pic.png"
                          alt={"review image"}
                          objectFit="contain"
                          layout="fill"
                        />
                      </div>

                      <div className="mt-5 flex flex-col items-center justify-center space-y-2 text-sm">
                        <h1 className="font-bold">Panama With Jack and Jon</h1>
                        <p> 📍 Panama City, Panama</p>

                        <div className="flex justify-center font-bold">
                          {/* <p className="w-fit flex-row rounded-lg bg-[#09786C] p-3 text-white">
                            Create an account
                          </p> */}

                          <Button
                            variant="outline"
                            className=" w-fit border border-[#09786C] bg-[#09786C] text-sm font-bold text-black transition duration-300 ease-in-out"
                          >
                            Create an account
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
