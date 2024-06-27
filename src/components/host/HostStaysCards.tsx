import Image from "next/image";
import { Button } from "../ui/button";

export default function HostStaysCards() {
  const stays = [
    {
      propertyImg: "/assets/images/footer-img.png",
      propertyName:
        "Modern Apartment with a view and other stuff words words title title title",
      propertyLocation: "New York, NY",
      checkIn: "Apr 25",
      checkOut: "Apr 30",
      nightlyCost: 150,
      totalCost: 600,
      guests: ["John Doe", "Jane Doe"],
    },
    {
      propertyImg: "/assets/images/footer-img.png",
      propertyName: "Modern Apartment with a view",
      propertyLocation: "New York, NY",
      checkIn: "Apr 25",
      checkOut: "Apr 30",
      nightlyCost: 150,
      totalCost: 600,
      guests: ["John Doe", "Jane Doe"],
    },
  ];

  return (
    <div className="space-y-6">
      {stays.map((stay, index) => (
        <div
          className="grid grid-cols-7 items-center gap-4 overflow-hidden rounded-2xl border"
          key={index}
        >
          <div className=" h-28">
            <Image
              src={stay.propertyImg}
              alt={stay.propertyName}
              width={200}
              height={200}
              className="object-cover"
            />
          </div>
          <div className="col-span-2">
            <h1 className="text-balance font-bold">{stay.propertyName}</h1>
            <p className="text-muted-foreground">{stay.propertyLocation}</p>
          </div>
          <div>
            <p className="font-bold">
              {stay.checkIn} - {stay.checkOut}
            </p>
            <p className=" text-sm text-blue-600">Checks out in 2 days</p>
          </div>
          <div>
            <p className="font-bold">${stay.nightlyCost} / night</p>
            <p className="text-muted-foreground">${stay.totalCost} total</p>
          </div>
          <div>
            <p>
              <span className="underline">{stay.guests[0]}</span>{" "}
              <span className="text-muted-foreground">
                + {stay.guests.length - 1}{" "}
                {stay.guests.length - 1 > 1 ? "guests" : "guest"}
              </span>
            </p>
          </div>
          <div className="mr-4 text-end">
            <Button variant="secondary" className="border-none font-bold">
              Message
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
