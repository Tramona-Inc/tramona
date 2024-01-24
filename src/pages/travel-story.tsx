import VideoDisplay from "@/components/_common/VideoDisplay";
import { Button } from "@/components/ui/button";
import Share from "@/components/_icons/ShareIcon";
import Image from "next/image";
import Turkey from "public/assets/images/travel-story/turkey.png";
import Japan from "public/assets/images/travel-story/japan.png";
import France from "public/assets/images/travel-story/france.png";
import type { StaticImageData } from "next/image";

export default function TravelStory() {
  return (
    <div className="flex flex-col">
      <div className="grid bg-black px-12 py-16 text-white md:grid-cols-2">
        <div className="col-span-1 p-4">
          <p className="mb-6 text-4xl font-bold">Panama with Jack and Jon</p>
          <p className="mb-4 text-2xl font-bold">
            A dream vacation in beautiful Panama
          </p>
          <p className="mb-8">
            Thanks to Tramona, Jak and Jon effortlessly arranged their Panama
            adventure by connecting directly with a local host. By submitting a
            travel request on the platform, they received personalized offers,
            enabling them to secure an excellent deal for their stay. Watch the
            video to see their adventure!
          </p>
          <Button className="mr-4 rounded-md border border-white bg-black hover:bg-gray-700/90">
            View More Stories
          </Button>
          <Button className="rounded-md border border-white bg-black hover:bg-gray-700/90">
            <Share /> <span className="ml-2">Share</span>
          </Button>
        </div>

        <div className="col-span-1">
          <VideoDisplay url="/assets/videos/travel-story.mp4" />
        </div>
      </div>

      <div className="bg-white py-10">
        <p className="mb-4 px-12 text-4xl font-bold">
          Recommended Destinations
        </p>
        <div className="grid gap-4 px-10 md:grid-cols-3">
          <ImageText
            img={Turkey}
            alt="turkey"
            title="Turkey"
            text="Turkey, situated at the crossroads of Europe and Asia, boasts a rich cultural heritage, stunning landscapes, and a diverse blend of modern and historical attractions"
          />
          <ImageText
            img={Japan}
            alt="japan"
            title="Japan"
            text="Japan, an island nation in East Asia, captivates visitors with its unique blend of traditional tea ceremonies, cutting-edge technology, cherry blossoms, and a deep-rooted cultural tapestry."
          />
          <ImageText
            img={France}
            alt="france"
            title="France"
            text="France, renowned for its exquisite cuisine, iconic landmarks such as the Eiffel Tower, and a rich artistic heritage, invites visitors to savor its charm and elegance."
          />
        </div>
      </div>
    </div>
  );
}

function ImageText({
  img,
  alt,
  title,
  text,
}: {
  img: StaticImageData;
  alt: string | null;
  title: string;
  text: string;
}): JSX.Element {
  return (
    <div className="relative text-white">
      <Image src={img} alt={alt ?? ""} className="rounded-lg" />
      <div className="absolute top-2 px-4 text-lg font-bold">{title}</div>
      <div className="absolute top-10 px-4 text-xs">{text}</div>
    </div>
  );
}
