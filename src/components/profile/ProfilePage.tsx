import {
  Camera,
  Edit,
  Facebook,
  Instagram,
  Share,
  Twitter,
  Youtube,
} from "lucide-react";
import { Button } from "../ui/button";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-3">
      <div className="rounded-lg border">
        <div className="relative h-52 bg-teal-900">
          {/* <img
            src="https://t3.ftcdn.net/jpg/05/70/41/84/360_F_570418433_m1DoCjzGbZhDQKs96hMThzUz736s2zhl.jpg"
            alt=""
            className="w-full object-cover"
          />
          <p>image will go here</p> */}
          <Button className="absolute bottom-4 right-4 bg-primary/20">
            <Camera />
            Edit Cover Photo
          </Button>
        </div>
        <div className="relative grid grid-cols-4 bg-slate-100 px-6 py-8">
          <img
            src="https://images.ctfassets.net/rt5zmd3ipxai/25pHfG94sGlRALOqbRvSxl/9f591d8263607fdf923b962cbfcde2a9/NVA-panda.jpg"
            alt=""
            className="absolute bottom-3 left-10 h-40 w-40 rounded-full border border-white object-cover"
          />
          <div className="col-span-2 col-start-2 flex flex-col gap-1">
            <h2 className="text-2xl font-bold">Aaron Soukaphay</h2>
            <p className="font-semibold">Tustin CA, USA</p>
            <div className="flex space-x-2">
              <Facebook />
              <Youtube />
              <Instagram />
              <Twitter />
            </div>
          </div>
          <div className="col-start-4 flex justify-end gap-3">
            <Button className="bg-zinc-200 text-primary hover:bg-zinc-300">
              <Edit />
              Edit Profile
            </Button>
            <Button className="bg-zinc-200 text-primary hover:bg-zinc-300">
              <Share />
              Share
            </Button>
          </div>
        </div>
      </div>

      <div>About Me</div>

      <div>Bucket List</div>
    </div>
  );
}
